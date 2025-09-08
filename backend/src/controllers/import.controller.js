const { Op } = require('sequelize');
const db = require('../models');

// Create import and update stock
exports.create = async (req, res) => {
  const { supplier, arrivalDate, rawMaterials } = req.body;
  // rawMaterials = [{ rawMaterialId, receivedQty }]

  const t = await db.sequelize.transaction();
  try {
    const importCode = `IMP-${Date.now()}`;

    // Create import record
    const importRecord = await db.Import.create(
      { importCode, supplier, arrivalDate, status: 'PENDING' },
      { transaction: t }
    );

    // Update raw materials stock + link to import
    for (const item of rawMaterials) {
      const material = await db.RawMaterial.findByPk(item.rawMaterialId, { transaction: t });
      if (!material) throw new Error(`Raw material ID ${item.rawMaterialId} not found`);

      material.stock += item.receivedQty;
      await material.save({ transaction: t });

      await importRecord.addRawMaterial(item.rawMaterialId, {
        through: { receivedQty: item.receivedQty },
        transaction: t,
      });
    }

    await t.commit();
    res.status(201).json(importRecord);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// List imports
exports.list = async (req, res) => {
  const { page = 1, pageSize = 10, search = '' } = req.query;
  const where = search ? { supplier: { [Op.like]: `%${search}%` } } : {};

  const { rows, count } = await db.Import.findAndCountAll({
    where,
    include: [db.RawMaterial],
    limit: +pageSize,
    offset: (+page - 1) * pageSize,
    order: [['createdAt', 'DESC']],
  });

  res.json({ rows, total: count });
};

// Update import status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // PENDING, RECEIVED, CANCELLED

  try {
    const importRecord = await db.Import.findByPk(id);
    if (!importRecord) return res.status(404).json({ error: 'Import not found' });

    importRecord.status = status;
    await importRecord.save();

    res.json(importRecord);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

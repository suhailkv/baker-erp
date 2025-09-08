// src/controllers/production.controller.js
const { Op } = require('sequelize');
const db = require('../models');
const { withTransaction } = require('../utils/transaction');

// ----------------------
// Inline Utility Functions
// ----------------------
async function validateAndDeductStock(rawMaterials, transaction) {
  for (const item of rawMaterials) {
    const material = await db.RawMaterial.findByPk(item.rawMaterialId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!material) throw new Error(`Raw material ${item.rawMaterialId} not found`);
    if (material.current_stock < item.usedQty) {
      throw new Error(
        `Insufficient stock for ${material.name} (needed ${item.usedQty}, available ${material.current_stock})`
      );
    }
    material.current_stock = parseFloat(material.current_stock) - parseFloat(item.usedQty);
    await material.save({ transaction });
  }
}

async function restoreStock(production, transaction) {
  for (const rm of production.ProductionRawMaterials) {
    const usedQty = parseFloat(rm.usedQty || 0);
    if (usedQty > 0) {
      const material = await db.RawMaterial.findByPk(rm.RawMaterial.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      material.current_stock = parseFloat(material.current_stock) + usedQty;
      await material.save({ transaction });
    }
    // remove join record
    await db.ProductionRawMaterial.destroy({
      where: { production_id: production.id, raw_material_id: rm.RawMaterial.id },
      transaction,
    });
  }
}

// ----------------------
// Controllers
// ----------------------

/**
 * Create production batch
 * Body: { product_id, quantity, unit, rawMaterials: [{ rawMaterialId, usedQty }, ...] }
 */
exports.create = async (req, res) => {
  const { product_id, quantity, unit = 'kg', rawMaterials = [] } = req.body;
  if (!product_id || !quantity || !Array.isArray(rawMaterials)) {
    return res
      .status(400)
      .json({ error: 'product_id, quantity and rawMaterials are required' });
  }

  try {
    const production = await withTransaction(async (t) => {
      const batchCode = `BATCH-${Date.now()}`;

      // validate & deduct stock
      await validateAndDeductStock(rawMaterials, t);

      // create production
      const prod = await db.Production.create(
        { batch_code: batchCode, product_id, quantity, unit, status: 'ONGOING', stock: quantity },
        { transaction: t }
      );

      // attach raw materials
      for (const item of rawMaterials) {
        await db.ProductionRawMaterial.create(
          {
            production_id: prod.id,
            raw_material_id: item.rawMaterialId,
            usedQty: item.usedQty,
          },
          { transaction: t }
        );
      }

      return prod;
    });

    return res.status(201).json(production);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || 'Failed to create production' });
  }
};

/**
 * List productions with pagination & search
 * Query: page, pageSize, search, status
 */
exports.list = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '', status } = req.query;
    const where = search ? { productName: { [Op.like]: `%${search}%` } } : {};
    if (status) where.status = status;

    const { rows, count } = await db.Production.findAndCountAll({
      where,
      include: [
        {
          model: db.ProductionRawMaterial,
          include: [{ model: db.RawMaterial, include: db.ExpenseNameMaster }],
        },
        { model: db.ExpenseNameMaster },
      ],
      limit: +pageSize,
      offset: (+page - 1) * pageSize,
      order: [['created_at', 'DESC']],
    });

    return res.json({ rows, total: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to list productions' });
  }
};

/**
 * Get production by id (with raw materials and usedQty)
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const production = await db.Production.findByPk(id, {
      include: [
        {
          model: db.ProductionRawMaterial,
          include: [{ model: db.RawMaterial, include: db.ExpenseNameMaster }],
        },
        { model: db.ExpenseNameMaster },
      ],
    });
    if (!production) return res.status(404).json({ error: 'Production not found' });
    return res.json(production);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch production' });
  }
};

/**
 * Update production status
 * If status === 'CANCELLED' -> restore usedQty back to raw material stock (transactional)
 */
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['ONGOING', 'COMPLETED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updatedProduction = await withTransaction(async (t) => {
      const production = await db.Production.findByPk(id, {
        include: [
          {
            model: db.ProductionRawMaterial,
            include: [{ model: db.RawMaterial, include: db.ExpenseNameMaster }],
          },
          { model: db.ExpenseNameMaster },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!production) throw new Error('Production not found');

      const prevStatus = production.status;

      if (status === 'CANCELLED' && prevStatus !== 'CANCELLED') {
        await restoreStock(production, t);
      }

      production.status = status;
      await production.save({ transaction: t });

      return production;
    });

    return res.json(updatedProduction);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || 'Failed to update status' });
  }
};

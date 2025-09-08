// src/controllers/report.controller.js
const { Op, fn, col, literal } = require('sequelize');
const db = require('../models');

// KPI endpoint
exports.kpis = async (req, res) => {
  try {
    const rawMaterialsCount = await db.RawMaterial.count();

    // Assuming Production, Sale, Export models exist (we’ll create later)
    const productionCount = await db.Production.count({ where: { status: 'ONGOING' } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const salesToday = await db.Sale.sum('amount', {
      where: { created_at: { [Op.gte]: today } },
    });
    const pendingExports = await db.Export.count({ where: { status: 'PENDING' } });

    res.json({
      rawMaterials: rawMaterialsCount,
      production: productionCount,
      salesToday: salesToday || 0,
      pendingExports,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
};

// Weekly sales trend (last 7 days)
exports.salesTrend = async (req, res) => {
  try {
    const data = await db.Sale.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('SUM', col('amount')), 'total'],
      ],
      where: {
        created_at: {
          [Op.gte]: literal("CURDATE() - INTERVAL 7 DAY"),
        },
      },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sales trend' });
  }
};

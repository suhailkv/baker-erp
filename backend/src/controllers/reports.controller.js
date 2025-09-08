const db = require('../models');
const { Op } = require('sequelize');

exports.getReports = async (req, res) => {
  try {
    // Total counts
    const totalSales = await db.sequelize.query(
      `SELECT SUM(quantity * amount) as totalSales FROM Sales`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    const totalOrders = await db.Sale.count();
    const totalProduction = await db.Production.sum('quantity');
    const totalRawMaterials = await db.RawMaterial.sum('stock');

    // Sales trend (last 6 months)
    const salesTrend = await db.Sale.findAll({
      attributes: [
        [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('created_at'), '%Y-%m'), 'month'],
        [db.Sequelize.literal('SUM(quantity * amount)'), 'total'],
      ],
      group: ['month'],
      order: [[db.Sequelize.literal('month'), 'ASC']],
      raw: true,
    });

    // Top customers
    const topCustomers = await db.Sale.findAll({
      include: [{ model: db.Customer, attributes: ['id', 'name'] }],
      attributes: [
        'customer_id',
        [db.Sequelize.literal('SUM(quantity * amount)'), 'totalSpent'],

      ],
      group: ['customer_id'],
      order: [[db.Sequelize.literal('totalSpent'), 'DESC']],
      limit: 5,
      raw: true,
    });

    // Low stock raw materials
    const lowStockMaterials = await db.RawMaterial.findAll({
      where: { stock: { [Op.lt]: 50 } }, // threshold
      raw: true,
    });

    return res.json({
      kpis: {
        totalSales,
        totalOrders,
        totalProduction,
        totalRawMaterials,
      },
      salesTrend,
      topCustomers,
      lowStockMaterials,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate reports' });
  }
};

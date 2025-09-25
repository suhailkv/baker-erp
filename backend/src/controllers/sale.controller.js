// src/controllers/sale.controller.js
const db = require('../models');
const { Op } = db.Sequelize;
const { Sale, Production, Customer, ExpenseNameMaster } = db;

const excelJS = require('exceljs');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const multer = require('multer');
const xlsx = require('xlsx');

// 🔹 Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });
exports.uploadMiddleware = upload.single('file');

// ----------------------
// Helpers
// ----------------------
const generateOrderCode = async () => {
  const lastSale = await Sale.findOne({ order: [['createdAt', 'DESC']] });
  let nextNumber = 1;
  if (lastSale && lastSale.order_code) {
    const lastCode = lastSale.order_code.split('-').pop();
    nextNumber = parseInt(lastCode, 10) + 1;
  }
  return `SO-${new Date().getFullYear()}-${String(nextNumber).padStart(5, '0')}`;
};

function validatePositiveNumber(value, fieldName) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) throw new Error(`${fieldName} must be a positive number`);
  return num;
}

// ----------------------
// Controllers
// ----------------------

// ✅ Create Sale
exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { production_id, customer_id, quantity, price } = req.body;
    const qty = validatePositiveNumber(quantity, 'Quantity');
    const unitPrice = validatePositiveNumber(price, 'Price');

    const order_code = await generateOrderCode();

    const production = await Production.findByPk(production_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!production) throw new Error('Production not found');
    if (qty > production.stock) {
      throw new Error(`Insufficient stock. Available: ${production.stock}`);
    }

    // Reduce stock
    production.stock -= qty;
    await production.save({ transaction: t });

    const sale = await Sale.create(
      {
        order_code,
        production_id,
        customer_id,
        quantity: qty,
        amount: unitPrice,
        total_amount: qty * unitPrice,
        status: 'PAID',
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(sale);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Sales
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, customer, production, order_code } = req.query;

    const where = {};
    const orConditions = [];

    if (customer) {
      orConditions.push({ '$Customer.name$': { [Op.like]: `%${customer}%` } });
    }
    if (production) {
      orConditions.push({
        '$Production.ExpenseNameMaster.expense_name$': { [Op.like]: `%${production}%` },
      });
    }
    if (order_code) {
      orConditions.push({ order_code: { [Op.like]: `%${order_code}%` } });
    }
    if (orConditions.length > 0) where[Op.or] = orConditions;

    const sales = await Sale.findAndCountAll({
      where,
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone'] },
        {
          model: Production,
          attributes: ['id', 'product_id', 'batch_code', 'stock', 'status'],
          include: [{ model: ExpenseNameMaster, attributes: ['expense_name'] }],
        },
      ],
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      rows: sales.rows,
      count: sales.count,
      currentPage: +page,
      totalPages: Math.ceil(sales.count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Sale by ID
exports.getById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone'] },
        {
          model: Production,
          attributes: ['id', 'product_id', 'batch_code', 'stock', 'status'],
          include: [{ model: ExpenseNameMaster, attributes: ['expense_name'] }],
        },
      ],
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Sale (adjust stock safely)
exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { production_id, quantity, price, customer_id } = req.body;

    const sale = await Sale.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!sale) throw new Error('Sale not found');

    const newQty = validatePositiveNumber(quantity, 'Quantity');
    const unitPrice = validatePositiveNumber(price, 'Price');

    const production = await Production.findByPk(production_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!production) throw new Error('Production not found');

    // Restore old stock
    production.stock += sale.quantity;

    // Validate new quantity
    if (newQty > production.stock) {
      throw new Error(`Insufficient stock. Available: ${production.stock}`);
    }

    // Deduct new quantity
    production.stock -= newQty;
    await production.save({ transaction: t });

    await sale.update(
      {
        production_id,
        customer_id,
        quantity: newQty,
        amount: unitPrice,
        total_amount: newQty * unitPrice,
      },
      { transaction: t }
    );

    await t.commit();
    res.json(sale);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update Status (cancel = restore stock)
exports.updateStatus = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [Production],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!sale) throw new Error('Sale not found');

    const { status } = req.body;
    if (status === 'CANCELLED' && sale.status !== 'CANCELLED') {
      await Production.increment(
        { stock: sale.quantity },
        { where: { id: sale.production_id }, transaction: t }
      );
    }

    sale.status = status;
    await sale.save({ transaction: t });

    await t.commit();
    res.json(sale);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Sale (restore stock)
exports.remove = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const sale = await Sale.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!sale) throw new Error('Sale not found');

    const production = await Production.findByPk(sale.production_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (production) {
      production.stock += sale.quantity;
      await production.save({ transaction: t });
    }

    await sale.destroy({ transaction: t });
    await t.commit();

    res.json({ message: 'Sale deleted and stock restored' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

// ✅ Bulk Import (CSV/Excel)
exports.bulkImport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const validRows = rows.map((r) => ({
      production_id: r.production_id,
      customer_id: r.customer_id,
      quantity: validatePositiveNumber(r.quantity, 'Quantity'),
      amount: validatePositiveNumber(r.amount, 'Amount'),
      total_amount: r.quantity * r.amount,
    }));

    const sales = await Sale.bulkCreate(validRows, { validate: true });
    res.json({ message: 'Sales imported successfully', count: sales.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Bulk Export (CSV/Excel/PDF)
exports.bulkExport = async (req, res) => {
  try {
    const { format } = req.query;
    const sales = await Sale.findAll({ include: [Production] });
    if (sales.length === 0) return res.status(404).json({ error: 'No sales data to export' });

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(sales.map((s) => s.toJSON()));
      res.header('Content-Type', 'text/csv');
      res.attachment('sales.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const workbook = new excelJS.Workbook();
      const sheet = workbook.addWorksheet('Sales');
      sheet.addRow(Object.keys(sales[0].toJSON()));
      sales.forEach((s) => sheet.addRow(Object.values(s.toJSON())));
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=sales.xlsx');
      await workbook.xlsx.write(res);
      return res.end();
    }

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=sales.pdf');
      doc.pipe(res);
      sales.forEach((s, i) => {
        doc.text(`${i + 1}. Sale ID: ${s.id}, Qty: ${s.quantity}, Amount: ${s.amount}`);
      });
      doc.end();
      return;
    }

    res.status(400).json({ error: 'Unsupported export format' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

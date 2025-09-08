const { Op } = require('sequelize');
const db = require('../models');
const fs = require('fs');
const { parseFile, exportCSV, exportExcel, exportPDF } = require('../utils/fileHandler');

const { RawMaterial, ExpenseNameMaster } = db;

// ----------------------
// Inline Validation Helpers
// ----------------------
function validateStock(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) throw new Error('Stock must be a non-negative number');
  return num;
}

function validateAmount(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) throw new Error('Amount must be a non-negative number');
  return num;
}

// ----------------------
// Controllers
// ----------------------

// Add new raw material
exports.add = async (req, res) => {
  try {
    const { expense_name_id, unit = null, stock: initial_stock = 0, amount = 0, type, date } = req.body;

    const material = await RawMaterial.create({
      expense_name_id,
      unit,
      initial_stock: validateStock(initial_stock),
      current_stock: validateStock(initial_stock),
      amount_spent: validateAmount(amount),
      expense_type: type || 1, // default Raw Material
      spent_on: date || null,
    });

    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List raw materials with pagination
exports.list = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sort = 'id', order = 'ASC', search = '' } = req.query;
    const where = search ? { name: { [Op.like]: `%${search}%` } } : {};

    const { rows, count } = await RawMaterial.findAndCountAll({
      where,
      include: [{ model: ExpenseNameMaster }],
      limit: +pageSize,
      offset: (+page - 1) * pageSize,
      order: [[sort, order]],
    });

    res.json({ rows, total: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update raw material
exports.update = async (req, res) => {
  try {
    const material = await RawMaterial.findByPk(req.params.id);
    if (!material) return res.status(404).json({ error: 'Not found' });

    const { stock: current_stock, amount, type: expense_type, date: spent_on, unit } = req.body;

    await material.update({
      unit,
      current_stock: current_stock !== undefined ? validateStock(current_stock) : material.current_stock,
      expense_type: expense_type || material.expense_type,
      spent_on: spent_on || material.spent_on,
      amount_spent: amount !== undefined ? validateAmount(amount) : material.amount_spent,
    });

    res.json(material);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete raw material
exports.remove = async (req, res) => {
  try {
    const material = await RawMaterial.findByPk(req.params.id);
    if (!material) return res.status(404).json({ error: 'Not found' });

    await material.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Bulk Import (CSV/Excel)
exports.bulkImport = async (req, res) => {
  try {
    const filePath = req.file.path;
    const jsonData = parseFile(filePath);

    let count = 0;
    for (const item of jsonData) {
      const initial = validateStock(item.initial_stock || 0);
      const price = validateAmount(item.price_per_unit || 0);

      await RawMaterial.create({
        name: item.name,
        unit: item.unit || '',
        initial_stock: initial,
        current_stock: initial,
        price_per_unit: price,
        amount_spent: initial * price,
      });
      count++;
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Bulk import successful', count });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Bulk Export
exports.bulkExport = async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const materials = await RawMaterial.findAll();

    const data = materials.map((m) => m.toJSON());

    if (format === 'csv') {
      const csv = exportCSV(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('raw-materials.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const excel = exportExcel(data);
      res.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.attachment('raw-materials.xlsx');
      return res.send(excel);
    }

    if (format === 'pdf') {
      res.header('Content-Type', 'application/pdf');
      res.attachment('raw-materials.pdf');
      return exportPDF(data, res);
    }

    res.status(400).json({ error: 'Invalid format' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

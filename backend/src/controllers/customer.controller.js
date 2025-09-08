const db = require('../models');
const Customer = db.Customer;

exports.getAll = async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [['name', 'ASC']] });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const existing = await Customer.findOne({ where: { phone } });
    if (existing) return res.status(400).json({ error: 'Customer already exists' });

    const customer = await Customer.create({ name, phone });
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

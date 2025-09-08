const db = require('../models');

const addExpenseName = async (req, res) => {
    try {
        const { name ,type} = req.body;
        if (!name ) {
            return res.status(400).json({ error: 'Name and category are required' });
        }
        const expenseName = await db.ExpenseNameMaster.create({ expense_name : name ,category_id : type});
        res.status(201).json(expenseName);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const listExpenseNames = async (req, res) => {
    try {
        const type = req.query.type || 1; // default to Raw Material
        const expenseNames = await db.ExpenseNameMaster.findAll({
            // include: [{ model: db.ExpenseCategory }]
            where: { category_id: type }
        });
        res.json(expenseNames);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = {
    addExpenseName,
    listExpenseNames,
};
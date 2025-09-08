export const EXPENSE_TYPES = [
    { label: "Raw Material", value: "Raw Material" },
    { label: "Other Expense", value: "Other Expense" }
];

export const DEFAULT_FORM = {
    type: "Other Expense",
    expense_name_id: null,
    amount: 0,
    date: "",
    stock: 0,
    unit: "nos",
};

export const API_ENDPOINTS = {
    EXPENSE_NAMES: "/general/expense-names",
};

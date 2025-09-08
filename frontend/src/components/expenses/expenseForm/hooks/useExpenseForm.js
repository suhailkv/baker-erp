import { useState, useEffect } from "react";
import { DEFAULT_FORM } from "../config";

export const useExpenseForm = (initialData) => {
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [selectedExpenseName, setSelectedExpenseName] = useState(null);
    console.log(initialData,"initialData in hook")
    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.ExpenseNameMaster?.ExpenseCategory?.category_name
                    || initialData.type
                    || DEFAULT_FORM.type,
                expense_name_id: initialData.expense_name_id
                    || initialData.ExpenseNameMaster?.expense_name_id
                    || null,
                amount: initialData.amount
                    || initialData.amount_spent
                    || DEFAULT_FORM.amount,
                date: initialData.date?.substring(0, 10)
                    || initialData.spent_on
                    || initialData.createdAt?.substring(0, 10)
                    || DEFAULT_FORM.date,
                stock: initialData.initial_stock ?? DEFAULT_FORM.stock,
                unit: initialData.unit ?? DEFAULT_FORM.unit,
            });

            if (initialData.ExpenseNameMaster) {
                setSelectedExpenseName({
                    id: initialData.ExpenseNameMaster.expense_name_id,
                    name: initialData.ExpenseNameMaster.expense_name,
                });
            } else if (initialData.name) {
                setSelectedExpenseName({
                    id: initialData.expense_name_id,
                    name: initialData.name,
                });
            }
        } else {
            setFormData(DEFAULT_FORM);
            setSelectedExpenseName(null);
        }
    }, [initialData]);


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return { formData, setFormData, selectedExpenseName, setSelectedExpenseName, handleChange };
};

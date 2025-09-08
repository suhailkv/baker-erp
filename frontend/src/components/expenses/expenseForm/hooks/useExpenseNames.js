import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import { API_ENDPOINTS } from "../config";

export const useExpenseNames = () => {
    const [expenseNames, setExpenseNames] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchExpenseNames = async () => {
        setLoading(true);
        try {
            const res = await api.get(API_ENDPOINTS.EXPENSE_NAMES);
            setExpenseNames(res.data.map(d => ({ id: d.expense_name_id, name: d.expense_name })) || []);
        } catch (err) {
            console.error("Error fetching expense names:", err);
        } finally {
            setLoading(false);
        }
    };

    const addExpenseName = async (newName, category) => {
        try {
            const res = await api.post(API_ENDPOINTS.EXPENSE_NAMES, { ...newName, category ,type:1});
            const entry = { id: res.data.expense_name_id, name: res.data.expense_name };
            setExpenseNames(prev => [...prev, entry]);
            return entry;
        } catch (err) {
            console.error("Error adding expense name:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchExpenseNames();
    }, []);

    return { expenseNames, addExpenseName, loading };
};

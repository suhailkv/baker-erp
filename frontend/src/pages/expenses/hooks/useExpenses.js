import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

export const useExpenses = (search) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.BASE, { params: { search } });
      const modData =
        res.data.rows.map((d) => ({
          ...d,
          id: d.id,
          name: d.ExpenseNameMaster?.expense_name,
          type: d.expense_type === 1 ? "Raw Material" : "Other Expense",
          amount: d.amount_spent,
          date: d.spent_on || "No date specified",
        })) || [];
      setRows(modData);
      console.log("Fetched expenses:", modData);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveExpense = async (data, editId) => {
    try {
      const payload = { ...data, type: data.type === "Raw Material" ? 1 : 2 };
      if (editId) {
        await api.put(`${API_ENDPOINTS.BASE}/${editId}`, payload);
      } else {
        await api.post(API_ENDPOINTS.BASE, payload);
      }
      await fetchExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.BASE}/${id}`);
      await fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const exportExpenses = async (format) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.EXPORT}?format=${format}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `expenses.${format === "excel" ? "xlsx" : format}`
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error exporting expenses:", err);
    }
  };

  const importExpenses = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(API_ENDPOINTS.IMPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchExpenses();
    } catch (err) {
      console.error("Error importing expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [search]);

  return {
    rows,
    loading,
    fetchExpenses,
    saveExpense,
    deleteExpense,
    exportExpenses,
    importExpenses,
  };
};

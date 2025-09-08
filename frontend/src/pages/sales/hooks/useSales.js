import { useState, useCallback } from "react";
import { api } from "../../../lib/api";
import { API_ENDPOINTS } from "../config";

export const useSales = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSales = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.list, {
        params: { customer: search, order_code: search, production: search },
      });

      const formatted = (data.rows || data || []).map((s) => ({
  id: s.id,
  order_code: s.order_code,
  // keep raw objects for editing
  Customer: s.Customer || null,
  Production: s.Production || null,
  production_id: s.production_id,  // keep id
  customer_id: s.customer_id,      // keep id
  quantity: s.quantity,
  price: s.amount,
  total: s.amount * s.quantity,
  status: s.status,
  createdAt: new Date(s.createdAt).toLocaleDateString(),
 customer: s.Customer
          ? `${s.Customer.name} (${s.Customer.phone})`
          : "N/A",
        product: s.Production
          ? `${s.Production.ExpenseNameMaster?.expense_name || 'no-name'} (Batch ${s.Production.batch_code})`
          : "N/A",
  // still provide display-friendly values
//   customer: s.Customer ? `${s.Customer.name} (${s.Customer.phone})` : "N/A",
//   product: s.Production ? `${s.Production.productName} (Batch ${s.Production.batchCode})` : "N/A",
}));


      setRows(formatted);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSale = async (data, editId) => {
    if (editId) {
      await api.put(API_ENDPOINTS.update(editId), data);
    } else {
      await api.post(API_ENDPOINTS.create, data);
    }
    await fetchSales();
  };

  const deleteSale = async (id) => {
    await api.delete(API_ENDPOINTS.delete(id));
    await fetchSales();
  };

  const updateStatus = async (id, status) => {
    await api.put(API_ENDPOINTS.updateStatus(id), { status });
    await fetchSales();
  };

  const exportSales = async (format) => {
    const res = await api.get(API_ENDPOINTS.export(format), {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales.${format === "excel" ? "xlsx" : format}`
    );
    document.body.appendChild(link);
    link.click();
  };

  const importSales = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    await api.post(API_ENDPOINTS.import, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchSales();
  };

  return {
    rows,
    loading,
    fetchSales,
    saveSale,
    deleteSale,
    updateStatus,
    exportSales,
    importSales,
  };
};

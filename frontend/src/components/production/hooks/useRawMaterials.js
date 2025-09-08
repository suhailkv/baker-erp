import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { API_ENDPOINTS } from "../config";

export const useRawMaterials = (open) => {
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.RAW_MATERIALS, {
        params: { page: 1, pageSize: 1000 },
      });

      const mats = (data.rows || []).map((r) => ({
        id: r.id, // use this as unique key
        name: r.ExpenseNameMaster?.expense_name || "Unnamed",
        stock: r.current_stock ?? 0,
        unit: r.unit || "",
        expenseNameId: r.expense_name_id, // keep if needed later
      }));

      setMaterials(mats);
    } catch (err) {
      console.error("Error fetching raw materials:", err);
    }
  };

  useEffect(() => {
    if (open) fetchMaterials();
  }, [open]);

  return { materials };
};

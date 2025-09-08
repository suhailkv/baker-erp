import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { API_ENDPOINTS } from "../config";

export const useProducts = (open) => {
  const [products, setProducts] = useState([]);

 const fetchProducts = async () => {
  try {
    const { data } = await api.get(API_ENDPOINTS.PRODUCTS, { params: { type: 2 } });
    setProducts(
      data.map((p) => ({
        id: p.expense_name_id,   // correct field
        name: p.expense_name,    // correct field
      }))
    );
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

const addProduct = async (name) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.PRODUCTS, { name: name, type: 2 });
    const entry = { id: data.expense_name_id, name: data.expense_name };
    setProducts((prev) => [...prev, entry]);
    return entry;
  } catch (err) {
    console.error("Error adding product:", err);
    throw err;
  }
};


  useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  return { products, addProduct };
};

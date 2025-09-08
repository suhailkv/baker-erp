import { useEffect, useState, useRef } from "react";
import { api } from "../../../lib/api";

export const useSaleForm = (initialData) => {
  const [formData, setFormData] = useState({
    production_id: "",
    quantity: 0,
    customer_id: null,
    price: 0,
  });

  const [productions, setProductions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(null);
  const [error, setError] = useState("");

  const newCustomerNameRef = useRef(null);

  // hydrate when editing
  useEffect(() => {
  if (initialData) {
    setFormData({
      production_id: initialData.production_id || "",
      quantity: initialData.quantity || 0,
      customer_id: initialData.customer_id || null,
      price: initialData.price || 0,
    });

    if (initialData.Customer) setSelectedCustomer(initialData.Customer);
  } else {
    setFormData({ production_id: "", quantity: 0, customer_id: null, price: 0 });
    setSelectedCustomer(null);
  }
}, [initialData]);


  // load productions and customers
  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const res = await api.get("/productions?status=COMPLETED");
        setProductions(res.data.rows || res.data || []);
      } catch (err) {
        console.error("Failed to fetch productions:", err);
      }
    };
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };
    fetchProductions();
    fetchCustomers();
  }, []);

  // auto focus name when new customer mode
  useEffect(() => {
    if (newCustomer && newCustomerNameRef.current) {
      newCustomerNameRef.current.focus();
    }
  }, [newCustomer]);

  const handleCustomerChange = (event, newValue) => {
    if (typeof newValue === "string") {
      setNewCustomer({ name: newValue, phone: "" });
    } else if (newValue && newValue.inputValue) {
      setNewCustomer({ name: newValue.inputValue, phone: "" });
    } else {
      setSelectedCustomer(newValue);
      setFormData((prev) => ({ ...prev, customer_id: newValue ? newValue.id : null }));
    }
  };

  const addNewCustomer = async () => {
    try {
      const res = await api.post("/customers", newCustomer);
      const newC = res.data;
      setCustomers((prev) => [...prev, newC]);
      setSelectedCustomer(newC);
      setFormData((prev) => ({ ...prev, customer_id: newC.id }));
      setNewCustomer(null);
    } catch (err) {
      console.error("Failed to add new customer:", err);
    }
  };

  const cancelNewCustomer = () => setNewCustomer(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "quantity") {
      const selected = productions.find((p) => p.id === Number(formData.production_id));
      if (selected && Number(value) > selected.stock) {
        setError(`Quantity cannot exceed available stock (${selected.stock})`);
      } else {
        setError("");
      }
    }
  };

  const totalAmount =
    (Number(formData.quantity) || 0) * (Number(formData.price) || 0);

  return {
    formData,
    setFormData,
    productions,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    newCustomerNameRef,
    error,
    handleCustomerChange,
    addNewCustomer,
    cancelNewCustomer,
    handleChange,
    totalAmount,
  };
};

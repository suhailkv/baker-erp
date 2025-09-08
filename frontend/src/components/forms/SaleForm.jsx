import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Stack, Autocomplete, Typography
} from '@mui/material';
import { api } from '../../lib/api';

const SaleForm = ({ open, handleClose, handleSave, initialData }) => {
  console.log(initialData,"initialData")
  const [formData, setFormData] = useState({
    production_id: '',
    quantity: 0,
    customer_id: null,
    price: 0,
  });

  const [productions, setProductions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(null);
  const [error, setError] = useState('');

  const newCustomerNameRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.Customer) {
        setSelectedCustomer(initialData.Customer);
      }
    } else {
      setFormData({ production_id: '', quantity: 0, customer_id: null, price: 0 });
      setSelectedCustomer(null);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const res = await api.get('/productions?status=COMPLETED');
        setProductions(res.data.rows || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers');
        setCustomers(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductions();
    fetchCustomers();
  }, []);

  // focus name input when entering new customer mode
  useEffect(() => {
    if (newCustomer && newCustomerNameRef.current) {
      newCustomerNameRef.current.focus();
    }
  }, [newCustomer?.id]);

  const handleCustomerChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setNewCustomer({ name: newValue, phone: '' });
    } else if (newValue && newValue.inputValue) {
      setNewCustomer({ name: newValue.inputValue, phone: '' });
    } else {
      setSelectedCustomer(newValue);
      setFormData({ ...formData, customer_id: newValue ? newValue.id : null });
    }
  };

  const addNewCustomer = async () => {
    try {
      const res = await api.post('/customers', newCustomer);
      const newC = res.data;
      setCustomers([...customers, newC]);
      setSelectedCustomer(newC);
      setFormData({ ...formData, customer_id: newC.id });
      setNewCustomer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelNewCustomer = () => {
    setNewCustomer(null);
  };

  const onSave = () => {
    if (!formData.customer_id) {
      alert('Please select or add a customer');
      return;
    }
    handleSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'quantity') {
      const selected = productions.find(p => p.id === Number(formData.production_id));
      if (selected && Number(value) > selected.stock) {
        setError(`Quantity cannot exceed available stock (${selected.stock})`);
      } else {
        setError('');
      }
    }
  };

  // 🔹 Calculate total
  const totalAmount = (Number(formData.quantity) || 0) * (Number(formData.price) || 0);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{initialData ? 'Edit Sale' : 'Add Sale'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Production Batch"
            name="production_id"
            value={formData.production_id}
            onChange={handleChange}
            fullWidth
          >
            {productions.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>
                {prod.productName} (Batch #{prod.id}) — Stock: {prod.stock}
              </MenuItem>
            ))}
          </TextField>

          {/* Autocomplete for Customers */}
          <Autocomplete
            value={selectedCustomer}
            onChange={handleCustomerChange}
            options={customers}
            getOptionLabel={(option) =>
              option.name && option.phone ? `${option.name} (${option.phone})` : ''
            }
            renderInput={(params) => (
              <TextField {...params} label="Customer" fullWidth />
            )}
            freeSolo
            disabled={!!newCustomer}
          />

          {/* If user typed a new customer, show quick add form */}
          {newCustomer && (
            <Stack spacing={1} direction="row" alignItems="center">
              <TextField
                label="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                inputRef={newCustomerNameRef}
              />
              <TextField
                label="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
              <Button variant="contained" onClick={addNewCustomer}>Add</Button>
              <Button variant="outlined" color="secondary" onClick={cancelNewCustomer}>Cancel</Button>
            </Stack>
          )}

          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            error={!!error}
            helperText={error}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />

          {/* 🔹 Total Sale Amount */}
          <Typography variant="h6" align="right" sx={{ mt: 2 }}>
            Total: <strong>{totalAmount.toFixed(2)}</strong>
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary" disabled={!!error}>
          {initialData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleForm;

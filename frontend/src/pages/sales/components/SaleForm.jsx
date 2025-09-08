import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Stack, Autocomplete, Typography } from "@mui/material";
import { useSaleForm } from "../hooks/useSaleForm";

export default function SaleForm({ open, handleClose, handleSave, initialData }) {
    const { formData, productions, customers, selectedCustomer, newCustomer, setNewCustomer, newCustomerNameRef, error,handleCustomerChange, addNewCustomer, cancelNewCustomer, handleChange, totalAmount } = useSaleForm(initialData);

    const onSave = () => {
        if (!formData.customer_id) {
            alert("Please select or add a customer");
            return;
        }
        handleSave(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{initialData ? "Edit Sale" : "Add Sale"}</DialogTitle>
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
                            option.name && option.phone ? `${option.name} (${option.phone})` : ""
                        }
                        renderInput={(params) => <TextField {...params} label="Customer" fullWidth />}
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
                            <Button variant="outlined" color="secondary" onClick={cancelNewCustomer}>
                                Cancel
                            </Button>
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
                    {initialData ? "Update" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

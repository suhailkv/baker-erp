import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useExpenseForm } from "./hooks/useExpenseForm";
import { useExpenseNames } from "./hooks/useExpenseNames";
import ExpenseTypeSelector from "./ExpenseTypeSelector";
import ExpenseNameAutocomplete from "./ExpenseNameAutocomplete";
import NewExpenseNameField from "./NewExpenseNameField";
import ExpenseAmountFields from "./ExpenseAmountFields";

const ExpenseForm = ({ open, handleClose, handleSave, initialData }) => {
    const { formData, setFormData, selectedExpenseName, setSelectedExpenseName, handleChange } = useExpenseForm(initialData);
    const { expenseNames, addExpenseName } = useExpenseNames();

    const [newExpenseName, setNewExpenseName] = useState(null);
    const newNameRef = useRef(null);

    useEffect(() => {
        if (newExpenseName && newNameRef.current) newNameRef.current.focus();
    }, [newExpenseName]);

    const handleExpenseNameChange = (event, newValue) => {
        if (typeof newValue === "string") {
            setNewExpenseName({ name: newValue });
        } else if (newValue && newValue.inputValue) {
            setNewExpenseName({ name: newValue.inputValue });
        } else {
            setSelectedExpenseName(newValue);
            setFormData({ ...formData, expense_name_id: newValue ? newValue.id : null });
        }
    };

    const handleAddNewExpenseName = async () => {
        try {
            const entry = await addExpenseName(newExpenseName, formData.type);
            setSelectedExpenseName(entry);
            setFormData({ ...formData, expense_name_id: entry.id });
            setNewExpenseName(null);
        } catch {
            // handle error gracefully (toast/snackbar)
        }
    };

    const handleSaveClick = () => {
        if (!formData.expense_name_id) {
            alert("Please select or add an expense name");
            return;
        }
        handleSave(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{initialData ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <ExpenseTypeSelector value={formData.type} onChange={handleChange} />

                    <ExpenseNameAutocomplete
                        value={selectedExpenseName}
                        onChange={handleExpenseNameChange}
                        options={expenseNames}
                        disabled={!!newExpenseName}
                    />

                    {newExpenseName && (
                        <NewExpenseNameField
                            newExpenseName={newExpenseName}
                            setNewExpenseName={setNewExpenseName}
                            onAdd={handleAddNewExpenseName}
                            onCancel={() => setNewExpenseName(null)}
                            ref={newNameRef}
                        />
                    )}

                    <ExpenseAmountFields formData={formData} handleChange={handleChange} />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSaveClick} variant="contained" color="primary">
                    {initialData ? "Update" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExpenseForm;

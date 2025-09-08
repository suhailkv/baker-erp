import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { EXPENSE_TYPES } from "./config";

const ExpenseTypeSelector = ({ value, onChange }) => (
    <TextField
        select
        label="Type"
        name="type"
        value={value}
        onChange={onChange}
        fullWidth
    >
        {EXPENSE_TYPES.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
            </MenuItem>
        ))}
    </TextField>
);

export default ExpenseTypeSelector;

import React from "react";
import { TextField } from "@mui/material";

const ExpenseAmountFields = ({ formData, handleChange }) => (
  <>
    <TextField
      label="Amount"
      name="amount"
      type="number"
      value={formData.amount}
      onChange={handleChange}
      fullWidth
    />

    <TextField
      label="Date of Purchase"
      name="date"
      type="date"
      value={formData.date}
      onChange={handleChange}
      fullWidth
      InputLabelProps={{ shrink: true }}
    />

    {formData.type === "Raw Material" && (
      <>
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          fullWidth
        />
      </>
    )}
  </>
);

export default ExpenseAmountFields;

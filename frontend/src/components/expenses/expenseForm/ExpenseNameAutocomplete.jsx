import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const ExpenseNameAutocomplete = ({ value, onChange, options, disabled }) => (
  <Autocomplete
    value={value}
    onChange={onChange}
    options={options}
    getOptionLabel={(option) => option.name || ""}
    renderInput={(params) => (
      <TextField {...params} label="Particulars" fullWidth />
    )}
    freeSolo
    disabled={disabled}
  />
);

export default ExpenseNameAutocomplete;

import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import { EXPORT_FORMATS } from "../config";

const ExpenseToolbar = ({ search, setSearch, onAdd, onExport, onImport }) => (
  <Stack direction="row" spacing={2} mb={2}>
    <TextField
      label="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      size="small"
    />
    <Button variant="contained" onClick={onAdd}>
      Add Expense
    </Button>
    {EXPORT_FORMATS.map((fmt) => (
      <Button key={fmt} variant="outlined" onClick={() => onExport(fmt)}>
        Export {fmt.toUpperCase()}
      </Button>
    ))}
    <Button variant="contained" component="label" color="secondary">
      Import
      <input
        type="file"
        hidden
        onChange={(e) => onImport(e.target.files[0])}
      />
    </Button>
  </Stack>
);

export default ExpenseToolbar;

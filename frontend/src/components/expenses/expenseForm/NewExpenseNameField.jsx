import React, { forwardRef } from "react";
import { TextField, Button, Stack } from "@mui/material";

const NewExpenseNameField = forwardRef(({ newExpenseName, setNewExpenseName, onAdd, onCancel }, ref) => (
  <Stack spacing={1} direction="row" alignItems="center">
    <TextField
      label="New Expense Name"
      value={newExpenseName.name}
      onChange={(e) => setNewExpenseName({ ...newExpenseName, name: e.target.value })}
      inputRef={ref}
    />
    <Button variant="contained" onClick={onAdd}>Add</Button>
    <Button variant="outlined" color="secondary" onClick={onCancel}>Cancel</Button>
  </Stack>
));

export default NewExpenseNameField;

import React from "react";
import { Stack, Typography, Divider } from "@mui/material";

const BatchInfo = ({ production }) => {
  if (!production) return null;
    console.log(production)
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {production.ExpenseNameMaster?.expense_name || production.productName} — {production.batch_code}
        </Typography>
        <Typography color="text.secondary">Status: {production.status}</Typography>
      </Stack>

      <Divider />

      <Typography variant="subtitle1">Batch</Typography>
      <Typography>
        Quantity: {production.quantity} {production.unit}
      </Typography>
      <Typography>
        Created at: {new Date(production.createdAt).toLocaleString("en-GB")}
      </Typography>
    </Stack>
  );
};

export default BatchInfo;

import React from "react";
import { Button, Stack } from "@mui/material";
import { API_ENDPOINTS, SALE_STATUSES } from "../config";

export default function SalesActionsCell({ row, onEdit, onDelete, onStatusChange }) {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" size="small" onClick={() => onEdit(row)}>
        Edit
      </Button>

      <Button
        variant="outlined"
        size="small"
        onClick={() =>
          onStatusChange(
            row.id,
            row.status === SALE_STATUSES.PAID
              ? SALE_STATUSES.CANCELLED
              : SALE_STATUSES.PAID
          )
        }
      >
        {row.status === SALE_STATUSES.PAID ? "Cancel" : "Mark Paid"}
      </Button>

      {row.status === SALE_STATUSES.PAID && (
        <Button
          variant="outlined"
          size="small"
          color="success"
          onClick={() =>
            window.open(`http://localhost:4000/api${API_ENDPOINTS.invoice(row.id)}`, "_blank")
          }
        >
          Invoice
        </Button>
      )}

      <Button
        variant="outlined"
        size="small"
        color="error"
        onClick={() => onDelete(row.id)}
      >
        Delete
      </Button>
    </Stack>
  );
}

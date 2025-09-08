import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";

const ExpenseTable = ({ rows, loading, onEdit, onDelete }) => {
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "current_stock", headerName: "Stock", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => onDelete(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      autoHeight
      pageSize={10}
      rowsPerPageOptions={[5, 10, 20]}
      disableSelectionOnClick
    />
  );
};

export default ExpenseTable;

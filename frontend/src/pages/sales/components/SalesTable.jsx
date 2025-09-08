import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import SalesActionsCell from "./SalesActionsCell";

export default function SalesTable({ rows, loading, onEdit, onDelete, onStatusChange }) {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_code", headerName: "Order Code", width: 150 },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "product", headerName: "Product (Batch)", flex: 1 },
    { field: "quantity", headerName: "Qty", width: 100 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "total", headerName: "Total", width: 140 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "createdAt", headerName: "Date", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      renderCell: (params) => (
        <SalesActionsCell
          row={params.row}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
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
}

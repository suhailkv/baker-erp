export const PRODUCTION_STATUSES = {
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
};

export const productionColumns = (onDetails, onComplete, onCancel) => [
  { field: "id", headerName: "ID", width: 80 },
  { field: "batch_code", headerName: "Batch Code", width: 180 },
  { field: "productName", headerName: "Product", flex: 1 },
  { field: "quantity", headerName: "Quantity", width: 120 },
  { field: "status", headerName: "Status", width: 140 },
  { field: "stock", headerName: "Stock", width: 140 },
  {
    field: "actions",
    headerName: "Actions",
    width: 220,
    renderCell: (params) => (
      <ProductionActions
        row={params.row}
        onDetails={onDetails}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    ),
  },
];

import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useSales } from "./hooks/useSales";
import SalesTable from "./components/SalesTable";
import SaleForm from "../../components/forms/SaleForm";

export default function SalesPage() {
  const {
    rows,
    loading,
    fetchSales,
    saveSale,
    deleteSale,
    updateStatus,
    exportSales,
    importSales,
  } = useSales();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchSales(search);
  }, [search, fetchSales]);

  const handleSave = async (data) => {
    await saveSale(data, editData?.id);
    setFormOpen(false);
    setEditData(null);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search by Customer / Order Code / Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Add Sale
        </Button>
        <Button variant="outlined" onClick={() => exportSales("csv")}>
          Export CSV
        </Button>
        <Button variant="outlined" onClick={() => exportSales("excel")}>
          Export Excel
        </Button>
        <Button variant="outlined" onClick={() => exportSales("pdf")}>
          Export PDF
        </Button>
        <Button variant="contained" component="label" color="secondary">
          Import
          <input
            type="file"
            hidden
            onChange={(e) => e.target.files[0] && importSales(e.target.files[0])}
          />
        </Button>
      </Stack>

      <SalesTable
        rows={rows}
        loading={loading}
        onEdit={(row) => {
          setEditData(row);
          setFormOpen(true);
        }}
        onDelete={deleteSale}
        onStatusChange={updateStatus}
      />

      <SaleForm
        open={formOpen}
        handleClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        handleSave={handleSave}
        initialData={editData}
      />
    </Box>
  );
}

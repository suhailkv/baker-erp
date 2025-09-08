import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import SaleForm from '../components/forms/SaleForm.jsx';
import { api } from '../lib/api';

const API_URL = 'http://localhost:5000/api/sales';

const Sales = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sales", { params: { search } });
      setRows(res.data.rows || res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleSave = async (data) => {
    try {
      if (editData) {
        await api.put(`/sales/${editData.id}`, data);
      } else {
        await api.post('/sales', data);
      }
      fetchData();
      setFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sales/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await api.get(`/sales/bulk-export?format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales.${format === 'excel' ? 'xlsx' : format}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/sales/bulk-import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'production_id', headerName: 'Production ID', width: 120 },
    { field: 'customerName', headerName: 'Customer', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'price', headerName: 'Price', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setEditData(params.row); setFormOpen(true); }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Add Sale
        </Button>
        <Button variant="outlined" onClick={() => handleExport('csv')}>
          Export CSV
        </Button>
        <Button variant="outlined" onClick={() => handleExport('excel')}>
          Export Excel
        </Button>
        <Button variant="outlined" onClick={() => handleExport('pdf')}>
          Export PDF
        </Button>
        <Button variant="contained" component="label" color="secondary">
          Import
          <input type="file" hidden onChange={handleImport} />
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />

      <SaleForm
        open={formOpen}
        handleClose={() => { setFormOpen(false); setEditData(null); }}
        handleSave={handleSave}
        initialData={editData}
      />
    </Box>
  );
};

export default Sales;

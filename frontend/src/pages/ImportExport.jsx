// src/pages/ImportExport.jsx
import React, { useCallback } from 'react';
import { Box, Paper, Stack, Typography, Button } from '@mui/material';
import DataTable from '../components/common/DataTable';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { api } from '../lib/api';

export default function ImportExport() {
  const importColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'importCode', headerName: 'Import Code', width: 160 },
    { field: 'supplier', headerName: 'Supplier', flex: 1 },
    { field: 'status', headerName: 'Status', width: 140 },
  ];

  const fetchImports = useCallback(async ({ page, pageSize, sortModel, searchText }) => {
    const { data } = await api.get('/imports', { params: { page: page + 1, pageSize, search: searchText || '' } });
    return { rows: data.rows, total: data.total };
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>Imports</Typography>
          <Button startIcon={<UploadFileIcon />} variant="contained">Upload CSV</Button>
        </Stack>
      </Paper>

      <DataTable columns={importColumns} fetchData={fetchImports} />
    </Box>
  );
}

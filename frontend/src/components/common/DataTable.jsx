// src/components/common/DataTable.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function CustomToolbar({ rows, columns }) {
  const exportCSV = () => {
    const header = columns.map(c => c.headerName || c.field);
    const data = rows.map(r => columns.map(c => r[c.field]));
    const csv = [header, ...data].map(r => r.map(v => `"${(v === null || v === undefined) ? '' : String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'export.csv');
  };

  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'export.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Export', 14, 16);
    const tableColumn = columns.map(c => c.headerName || c.field);
    const tableRows = rows.map(r => columns.map(c => r[c.field]));
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save('export.pdf');
  };

  return (
    <GridToolbarContainer>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
        <GridToolbarQuickFilter placeholder="Search…" />
        <Button startIcon={<FileDownloadIcon />} size="small" onClick={exportCSV}>CSV</Button>
        <Button startIcon={<FileDownloadIcon />} size="small" onClick={exportXLSX}>Excel</Button>
        <Button startIcon={<FileDownloadIcon />} size="small" onClick={exportPDF}>PDF</Button>
      </Stack>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function DataTable({ columns, fetchData, initialPageSize = 10, height = 600 }) {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortModel, setSortModel] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { rows: r, total } = await fetchData({
        page,
        pageSize,
        sortModel,
        searchText,
      });
      setRows(r.map((row) => ({ id: row.id, ...row })));
      setRowCount(total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortModel, searchText, fetchData]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Box sx={{ height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        pagination
        paginationMode="server"
        pageSize={pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        loading={loading}
        slots={{ toolbar: () => <CustomToolbar rows={rows} columns={columns} /> }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

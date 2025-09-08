// src/pages/reports/components/RawMaterialReport.jsx
import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { api } from "../../../lib/api";

export default function RawMaterialReport() {
  const [data, setData] = useState({ stock: [], lowStock: [], topSpent: [], totalPurchase: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/reports/raw-materials");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Total Purchase</Typography>
        <Typography variant="h4">{data.totalPurchase}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Current Stock</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.stock.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.stock}</TableCell>
                <TableCell>{m.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Low Stock Items</Typography>
        {data.lowStock.length === 0 ? (
          <Typography>No low stock items</Typography>
        ) : (
          <ul>
            {data.lowStock.map((m) => (
              <li key={m.id}>{m.name} — {m.stock} {m.unit}</li>
            ))}
          </ul>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Most Highly Spent Items</Typography>
        <ul>
          {data.topSpent.map((m) => (
            <li key={m.id}>{m.name} — {m.spent}</li>
          ))}
        </ul>
      </Paper>
    </Stack>
  );
}

// src/pages/reports/components/SalesReport.jsx
import React, { useEffect, useState } from "react";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Stack } from "@mui/material";
import { api } from "../../../lib/api";

export default function SalesReport() {
  const [sales, setSales] = useState({ totalRevenue: 0, topProducts: [], topCustomers: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/reports/sales");
        setSales(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Total Revenue</Typography>
        <Typography variant="h4">{sales.totalRevenue}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Top Products</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity Sold</TableCell>
              <TableCell>Total Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.topProducts.map((p, idx) => (
              <TableRow key={idx}>
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.totalQty}</TableCell>
                <TableCell>{p.totalRevenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Top Customers</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Total Orders</TableCell>
              <TableCell>Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.topCustomers.map((c, idx) => (
              <TableRow key={idx}>
                <TableCell>{c.customerName}</TableCell>
                <TableCell>{c.totalOrders}</TableCell>
                <TableCell>{c.totalSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}

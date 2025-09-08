// src/pages/reports/components/ProductionReport.jsx
import React, { useEffect, useState } from "react";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { api } from "../../../lib/api";

export default function ProductionReport() {
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/reports/productions");
        setProductions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Total Production by Product</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Total Quantity</TableCell>
            <TableCell>Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productions.map((p) => (
            <TableRow key={p.productId}>
              <TableCell>{p.productName}</TableCell>
              <TableCell>{p.totalQuantity}</TableCell>
              <TableCell>{p.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

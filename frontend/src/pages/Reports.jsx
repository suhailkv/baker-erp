import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { api } from "../lib/api";

const Reports = () => {
  const [data, setData] = useState({
    kpis: {},
    salesTrend: [],
    topCustomers: [],
    lowStockMaterials: [],
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  return (
    <Box p={2}>
      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        {[
          { label: "Total Sales", value: `₹${data.kpis.totalSales || 0}` },
          { label: "Orders", value: data.kpis.totalOrders || 0 },
          { label: "Production", value: data.kpis.totalProduction || 0 },
          { label: "Raw Materials", value: data.kpis.totalRawMaterials || 0 },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ bgcolor: "primary.dark", color: "white" }}>
              <CardContent>
                <Typography variant="h6">{kpi.label}</Typography>
                <Typography variant="h5">{kpi.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        {/* Sales Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Sales Trend (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data.salesTrend}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Customers */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Top Customers
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={data.topCustomers.map((c) => ({
                  name: c["Customer.name"],
                  total: c.totalSpent,
                }))}
              >
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#81c784" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Low Stock Materials */}
      <Box mt={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Low Stock Materials
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.lowStockMaterials.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default Reports;

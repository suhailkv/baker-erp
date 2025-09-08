// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Stack, Button, Divider } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InsightsIcon from '@mui/icons-material/Insights';
import { LineChart } from '@mui/x-charts/LineChart';
import { api } from '../lib/api';

function KpiCard({ title, value, icon }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={2}>
      {icon}
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h6" fontWeight={700}>{value}</Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({ rawMaterials: 0, production: 0, salesToday: 0, pendingExports: 0 });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const { data: k } = await api.get('/reports/kpis');
        setKpis(k);
      } catch (e) { /* ignore */ }
      try {
        const { data: trend } = await api.get('/reports/sales-trend');
        setSalesData(trend.map(t => ({ x: t.date, y: parseFloat(t.total) })));
      } catch (e) { /* ignore */ }
    }
    load();
  }, []);

  const cards = [
    { title: 'Raw Materials', value: kpis.rawMaterials, icon: <AddBoxIcon color="success" /> },
    { title: 'In Production', value: kpis.production, icon: <InsightsIcon color="info" /> },
    { title: 'Sales Today', value: `$${kpis.salesToday}`, icon: <AddShoppingCartIcon color="primary" /> },
    { title: 'Pending Exports', value: kpis.pendingExports, icon: <LocalShippingIcon color="warning" /> },
  ];

  return (
    <Box>
      <Grid container spacing={2} mb={3}>
        {cards.map(c => <Grid item xs={12} sm={6} md={3} key={c.title}><KpiCard {...c} /></Grid>)}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Weekly Sales Trend</Typography>
            <LineChart xAxis={[{ data: salesData.map(d => d.x) }]} series={[{ data: salesData.map(d => d.y), color: '#4caf50' }]} height={300} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>Quick Actions</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={2}>
              <Button variant="contained" startIcon={<AddShoppingCartIcon />}>New Sale Order</Button>
              <Button variant="contained" startIcon={<AddBoxIcon />}>Add Raw Material</Button>
              <Button variant="contained" startIcon={<LocalShippingIcon />}>Create Export</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

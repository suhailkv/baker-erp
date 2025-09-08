// src/pages/reports/Reports.jsx
import React from "react";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import RawMaterialReport from "./components/RawMaterialReport";
import ProductionReport from "./components/ProductionReport";
import SalesReport from "./components/SalesReport";

export default function Reports() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Reports & Analytics
        </Typography>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 2 }}>
          <Tab label="Raw Materials" />
          <Tab label="Productions" />
          <Tab label="Sales" />
        </Tabs>
      </Paper>

      {tab === 0 && <RawMaterialReport />}
      {tab === 1 && <ProductionReport />}
      {tab === 2 && <SalesReport />}
    </Box>
  );
}

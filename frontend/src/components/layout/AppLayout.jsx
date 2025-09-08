// src/components/layout/AppLayout.jsx
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const drawerWidth = 280;

export default function AppLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Topbar drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}

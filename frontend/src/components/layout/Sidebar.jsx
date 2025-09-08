// src/components/layout/Sidebar.jsx
import React from 'react';
import { Drawer, Box, Toolbar, Divider, List, Typography, ListSubheader } from '@mui/material';
import NavItem from './NavItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import ProductionIcon from '@mui/icons-material/Factory';
import SellIcon from '@mui/icons-material/Sell';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation } from 'react-router-dom';

const navItems = [
  // { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { title: 'Raw Materials', path: '/raw-materials', icon: <InventoryIcon /> },
  { title: 'Production', path: '/production', icon: <ProductionIcon /> },
  { title: 'Sales', path: '/sales', icon: <SellIcon /> },
  // { title: 'Import / Export', path: '/import-export', icon: <ImportExportIcon /> },
  { title: 'Users', path: '/users', icon: <PeopleIcon /> },
  // { title: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function Sidebar({ drawerWidth = 280 }) {
  const location = useLocation();
  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ py: 2, px: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>ERPVision</Typography>
          <Typography variant="caption" color="text.secondary">Manufacturing Suite</Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ px: 1, py: 2, overflowY: 'auto', flex: 1 }}>
        <List component="nav" subheader={<ListSubheader component="div" sx={{ bgcolor: 'transparent', color: 'text.secondary' }}>Main</ListSubheader>}>
          {navItems.map((n) => <NavItem key={n.path} to={n.path} title={n.title} icon={n.icon} selected={location.pathname === n.path} />)}
        </List>
      </Box>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">Version 0.1.0</Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="main navigation">
      <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' } }}>
        {content}
      </Drawer>
      <Drawer variant="temporary" open={false} onClose={() => {}} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {content}
      </Drawer>
    </Box>
  );
}

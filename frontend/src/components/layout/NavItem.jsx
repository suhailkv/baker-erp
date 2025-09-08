// src/components/layout/NavItem.jsx
import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NavItem({ icon, title, to = '#', selected = false }) {
  return (
    <ListItemButton component={RouterLink} to={to} selected={selected} sx={{ mb: 0.5, py: 1, px: 1.5 }}>
      <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{icon}</ListItemIcon>
      <ListItemText primary={title} primaryTypographyProps={{ fontWeight: 700, variant: 'body2' }} />
    </ListItemButton>
  );
}

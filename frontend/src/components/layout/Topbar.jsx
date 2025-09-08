// src/components/layout/Topbar.jsx
import React, { useRef, useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Box, Badge, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';

const SearchRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)',
  display: 'flex',
  alignItems: 'center',
  padding: '6px 10px',
}));

export default function Topbar({ drawerWidth = 280 }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [anchorUser, setAnchorUser] = useState(null);
  const { logout } = useAuth()
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AppBar position="fixed" color="transparent" elevation={1} sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        {!isMdUp && (
          <IconButton edge="start" color="inherit"><MenuIcon /></IconButton>
        )}
        <Typography variant="h6" noWrap sx={{ fontWeight: 900 }}>ERPVision</Typography>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <SearchRoot>
            <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
            <InputBase inputRef={inputRef} placeholder="Search (Ctrl+K)" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth />
          </SearchRoot>
        </Box>
        <IconButton color="inherit"><Badge badgeContent={3} color="error"><NotificationsIcon /></Badge></IconButton>
        <IconButton color="inherit"><AddIcon /></IconButton>
        <IconButton color="inherit"><SettingsIcon /></IconButton>
        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorUser(e.currentTarget)} size="small" sx={{ ml: 1 }}>
            <Avatar sx={{ width: 36, height: 36 }}>AD</Avatar>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorUser} open={Boolean(anchorUser)} onClose={() => setAnchorUser(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={logout}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Toolbar,
  Divider,
  List,
  Typography,
  ListSubheader,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
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
  { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { title: 'Raw Materials', path: '/raw-materials', icon: <InventoryIcon /> },
  { title: 'Production', path: '/production', icon: <ProductionIcon /> },
  { title: 'Sales', path: '/sales', icon: <SellIcon /> },
  { title: 'Import / Export', path: '/import-export', icon: <ImportExportIcon /> },
  { title: 'Users', path: '/users', icon: <PeopleIcon /> },
  { title: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

// Mobile Header Component
function MobileHeader({ onMenuClick, title }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'block', md: 'none' },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ minHeight: '56px !important' }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
          aria-label="open drawer"
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            ERPVision
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Manufacturing Suite
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Sidebar Content Component
function SidebarContent({ onClose, isMobile, isCollapsed, onToggleCollapse }) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Group nav items by category for better organization
  const mainNavItems = navItems.slice(0, 4);
  const managementNavItems = navItems.slice(4, 6);
  const systemNavItems = navItems.slice(6);

  const NavSection = ({ title, items, sectionKey }) => (
    <>
      <ListSubheader
        component="div"
        sx={{
          bgcolor: 'transparent',
          color: 'text.secondary',
          fontSize: '0.75rem',
          fontWeight: 600,
          px: isCollapsed ? 1 : 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          cursor: isCollapsed ? 'pointer' : 'default',
          minHeight: 32
        }}
        onClick={isCollapsed ? () => handleSectionToggle(sectionKey) : undefined}
      >
        {!isCollapsed && title}
        {isCollapsed && (
          <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
        )}
      </ListSubheader>
      <Collapse in={!isCollapsed || expandedSections[sectionKey]} timeout="auto">
        {items.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            title={item.title}
            icon={item.icon}
            selected={location.pathname === item.path}
            onClick={isMobile ? onClose : undefined}
            isCollapsed={isCollapsed}
          />
        ))}
      </Collapse>
    </>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Toolbar
        sx={{
          py: 2,
          px: isCollapsed ? 1 : 2,
          minHeight: '72px !important',
          position: 'relative'
        }}
      >
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
          >
            <CloseIcon />
          </IconButton>
        )}
        
        {!isMobile && !isCollapsed && (
          <IconButton
            onClick={onToggleCollapse}
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'flex-start' }}>
          {!isCollapsed ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                ERPVision
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manufacturing Suite
              </Typography>
            </>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.2rem' }}>
              ERP
            </Typography>
          )}
        </Box>
      </Toolbar>

      <Divider sx={{ mx: isCollapsed ? 1 : 2 }} />

      {/* Navigation */}
      <Box sx={{ px: 0, py: 1, overflowY: 'auto', flex: 1 }}>
        <List component="nav" dense>
          <NavSection title="Main" items={mainNavItems} sectionKey="main" />
          <NavSection title="Management" items={managementNavItems} sectionKey="management" />
          <NavSection title="System" items={systemNavItems} sectionKey="system" />
        </List>
      </Box>

      {/* Footer */}
      <Divider sx={{ mx: isCollapsed ? 1 : 2 }} />
      <Box sx={{ p: isCollapsed ? 1 : 2, textAlign: isCollapsed ? 'center' : 'left' }}>
        <Typography variant="caption" color="text.secondary">
          {isCollapsed ? 'v0.1' : 'Version 0.1.0'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ 
  drawerWidth = 280, 
  collapsedWidth = 72,
  onMobileToggle,
  mobileOpen = false 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpenState, setMobileOpenState] = useState(mobileOpen);

  // Handle mobile state changes
  useEffect(() => {
    setMobileOpenState(mobileOpen);
  }, [mobileOpen]);

  // Reset collapse state on mobile/desktop switch
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const handleMobileClose = () => {
    setMobileOpenState(false);
    if (onMobileToggle) {
      onMobileToggle(false);
    }
  };

  const handleMobileOpen = () => {
    setMobileOpenState(true);
    if (onMobileToggle) {
      onMobileToggle(true);
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const currentDrawerWidth = isCollapsed ? collapsedWidth : drawerWidth;

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader onMenuClick={handleMobileOpen} />

      {/* Navigation */}
      <Box
        component="nav"
        sx={{
          width: { md: currentDrawerWidth },
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
        aria-label="main navigation"
      >
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: currentDrawerWidth,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden'
            },
          }}
        >
          <SidebarContent
            onClose={handleMobileClose}
            isMobile={false}
            isCollapsed={isCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />
        </Drawer>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpenState}
          onClose={handleMobileClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <SidebarContent
            onClose={handleMobileClose}
            isMobile={true}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        </Drawer>
      </Box>

      {/* Mobile content offset */}
      {isMobile && <Toolbar sx={{ minHeight: '56px !important' }} />}
    </>
  );
}
// src/components/layout/NavItem.jsx
import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ 
  to, 
  title, 
  icon, 
  selected = false, 
  onClick,
  isCollapsed = false,
  disabled = false 
}) {
  const location = useLocation();
  const isActive = selected || location.pathname === to;

  const listItemButton = (
    <ListItemButton
      component={Link}
      to={to}
      selected={isActive}
      onClick={onClick}
      disabled={disabled}
      sx={{
        minHeight: 44,
        px: isCollapsed ? 1 : 2,
        py: 0.5,
        mx: 1,
        my: 0.25,
        borderRadius: 2,
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          '& .MuiListItemIcon-root': {
            color: 'primary.contrastText',
          },
        },
        '&:hover': {
          bgcolor: isActive ? 'primary.dark' : 'action.hover',
        },
        transition: theme => theme.transitions.create(['background-color', 'padding'], {
          duration: theme.transitions.duration.short,
        }),
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? 0 : 40,
          justifyContent: 'center',
          color: isActive ? 'inherit' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>
      
      {!isCollapsed && (
        <ListItemText
          primary={title}
          sx={{
            '& .MuiListItemText-primary': {
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
            },
          }}
        />
      )}

      {/* Active indicator for collapsed state */}
      {isCollapsed && isActive && (
        <Box
          sx={{
            position: 'absolute',
            right: -1,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 20,
            bgcolor: 'primary.main',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}
    </ListItemButton>
  );

  // Wrap with tooltip in collapsed state
  if (isCollapsed) {
    return (
      <ListItem disablePadding>
        <Tooltip title={title} placement="right" arrow>
          {listItemButton}
        </Tooltip>
      </ListItem>
    );
  }

  return (
    <ListItem disablePadding>
      {listItemButton}
    </ListItem>
  );
}
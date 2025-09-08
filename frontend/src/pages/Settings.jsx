// src/pages/Settings.jsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function Settings() {
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>Settings</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Company profile, integrations, and application settings.</Typography>
      </Paper>
    </Box>
  );
}

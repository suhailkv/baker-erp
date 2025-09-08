import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/raw-materials')}>
          Add Raw Material
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/productions')}>
          Start Production
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/sales')}>
          New Sale
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/imports')}>
          Record Import
        </Button>
      </Stack>
    </Box>
  );
};

export default QuickActions;

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const KPICard = ({ title, value }) => (
  <Card sx={{ bgcolor: 'background.paper', p: 2 }}>
    <CardContent>
      <Typography variant="h6" color="primary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

export default KPICard;

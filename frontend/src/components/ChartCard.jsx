import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, data }) => (
  <Card sx={{ bgcolor: 'background.paper', p: 2 }}>
    <CardContent>
      <Typography variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#00e676" strokeWidth={2} />
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="label" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ChartCard;

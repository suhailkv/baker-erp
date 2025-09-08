// src/pages/Login.jsx
import React, { useState } from 'react';
import { Box, Paper, Stack, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(form.email.trim(), form.password);
      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally { setBusy(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Paper sx={{ p: 4, width: 440, maxWidth: '100%' }} elevation={3}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900}>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to ERPVision</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField name="email" label="Email" value={form.email} onChange={onChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>) }} />
              <TextField name="password" label="Password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={onChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPwd(s => !s)} edge="end">{showPwd ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
              <Button variant="contained" type="submit" fullWidth disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

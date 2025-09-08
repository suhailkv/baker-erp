// src/components/forms/ProductionForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Autocomplete, Box, IconButton, Typography
} from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import { api } from '../../lib/api';

export default function ProductionForm({ open, onClose, onCreated }) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [materialsList, setMaterialsList] = useState([]); // available raw materials
  const [rows, setRows] = useState([
    { rawMaterialId: null, name: '', usedQty: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const { data } = await api.get('/raw-materials', { params: { page: 1, pageSize: 1000 } });
          // normalize rows: data.rows is array of raw materials
          const mats = (data.rows || []).map(r => ({ id: r.id, name: r.name, stock: r.stock, unit: r.unit }));
          setMaterialsList(mats);
        } catch (e) {
          console.error('Failed load raw materials', e);
        }
      })();
    } else {
      // reset on close
      setProductName(''); setQuantity(''); setUnit('kg'); setRows([{ rawMaterialId: null, name: '', usedQty: 0 }]); setError('');
    }
  }, [open]);

  const addRow = () => setRows((s) => [...s, { rawMaterialId: null, name: '', usedQty: 0 }]);
  const removeRow = (idx) => setRows((s) => s.filter((_, i) => i !== idx));
  const updateRow = (idx, patch) => setRows((s) => s.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const handleSubmit = async () => {
    setError('');
    try {
      if (!productName) throw new Error('Product name required');
      if (!quantity || Number(quantity) <= 0) throw new Error('Quantity must be > 0');
      const rawMaterials = rows
        .filter(r => r.rawMaterialId)
        .map(r => ({ rawMaterialId: r.rawMaterialId, usedQty: Number(r.usedQty) }));

      if (!rawMaterials.length) throw new Error('At least one raw material must be selected');

      // client-side validate stock
      for (const r of rawMaterials) {
        const mat = materialsList.find(m => m.id === r.rawMaterialId);
        if (!mat) throw new Error(`Material ${r.rawMaterialId} not found`);
        if (r.usedQty > mat.stock) throw new Error(`Insufficient stock for ${mat.name} (available ${mat.stock})`);
      }

      setLoading(true);
      const payload = { productName, quantity: Number(quantity), unit, rawMaterials };
      const { data } = await api.post('/productions', payload);
      setLoading(false);
      onCreated && onCreated(data);
      onClose(true);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.error || err.message || 'Failed to create');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>Create Production Batch</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField label="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth />
          <Stack direction="row" spacing={2}>
            <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" />
            <TextField label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </Stack>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Raw Materials</Typography>
            <Stack spacing={1}>
              {rows.map((row, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="center">
                  <Autocomplete
                    sx={{ flex: 1 }}
                    getOptionLabel={(opt) => opt?.name || ''}
                    options={materialsList}
                    value={materialsList.find(m => m.id === row.rawMaterialId) || null}
                    onChange={(_, v) => updateRow(idx, { rawMaterialId: v ? v.id : null, name: v ? v.name : '' })}
                    renderInput={(params) => <TextField {...params} label="Material" />}
                  />
                  <TextField
                    sx={{ width: 140 }}
                    label="Used Qty"
                    type="number"
                    value={row.usedQty}
                    onChange={(e) => updateRow(idx, { usedQty: e.target.value })}
                  />
                  <Typography sx={{ minWidth: 120 }} color="text.secondary">
                    {row.rawMaterialId ? (() => {
                      const mat = materialsList.find(m => m.id === row.rawMaterialId);
                      return `Stock: ${mat ? mat.stock : '—'}`;
                    })() : ''}
                  </Typography>
                  <IconButton color="error" onClick={() => removeRow(idx)} disabled={rows.length === 1}>
                    <RemoveCircleOutline />
                  </IconButton>
                </Stack>
              ))}

              <Button startIcon={<AddCircleOutline />} onClick={addRow} variant="outlined">Add material</Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating…' : 'Create Batch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

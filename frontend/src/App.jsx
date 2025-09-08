import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, LinearProgress } from '@mui/material';
import theme from './theme';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const RawMaterials = lazy(() => import('./pages/expenses/Expenses'));
const Production = lazy(() => import('./pages/production/ProductionPage'));
const Sales = lazy(() => import('./pages/sales/SalesPage'));
const ImportExport = lazy(() => import('./pages/ImportExport'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const Users = lazy(() => import('./pages/users/Users'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} />}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} /> */}
            <Route path="/raw-materials" element={<ProtectedRoute roles={['INVENTORY','ADMIN']}><AppLayout><RawMaterials /></AppLayout></ProtectedRoute>} />
            <Route path="/production" element={<ProtectedRoute roles={['PRODUCTION','ADMIN']}><AppLayout><Production /></AppLayout></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute roles={['SALES','ADMIN']}><AppLayout><Sales /></AppLayout></ProtectedRoute>} />
            {/* <Route path="/import-export" element={<ProtectedRoute roles={['ADMIN']}><AppLayout><ImportExport /></AppLayout></ProtectedRoute>} /> */}
            <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><AppLayout><Users /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

            <Route path="/" element={<Navigate to="/raw-materials" replace />} />
            <Route path="*" element={<Navigate to="/raw-materials" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

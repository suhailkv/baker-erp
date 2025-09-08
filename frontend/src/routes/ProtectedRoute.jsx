// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) return null; // could render a full-screen loader if you prefer
  if (!user) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.some(r => hasRole(r))) {
    return <Navigate to="/dashboard" replace />; // or a 403 page
  }

  return children;
}

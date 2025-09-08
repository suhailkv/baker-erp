// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { api, setAccessToken, clearAccessToken } from '../lib/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'erpv_session'; // stores access token (optional; could be memory-only)

function parseToken(token) {
  try { return jwtDecode(token); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { id, email, roles: [] }
  const [loading, setLoading] = useState(true);

  // restore from storage on load
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const { accessToken } = JSON.parse(cached);
      if (accessToken) {
        const claims = parseToken(accessToken);
        if (claims && claims.exp * 1000 > Date.now()) {
          setToken(accessToken);
          setAccessToken(accessToken);
          setUser({ id: claims.sub, email: claims.email, roles: claims.roles || [] });
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const accessToken = data?.accessToken;
    const claims = parseToken(accessToken);
    setToken(accessToken);
    setAccessToken(accessToken);
    setUser({ id: claims.sub, email: claims.email, roles: claims.roles || [] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken }));
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    clearAccessToken();
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasRole = useCallback((role) => !!user?.roles?.includes(role), [user]);

  const value = useMemo(() => ({
    user, token, loading, login, logout, hasRole,
  }), [user, token, loading, login, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// src/lib/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

let isRefreshing = false;
let refreshQueue = [];

function subscribeTokenRefresh(cb) { refreshQueue.push(cb); }
function onRefreshed(token) { refreshQueue.forEach(cb => cb(token)); refreshQueue = []; }

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // allows httpOnly refresh cookies if you choose
  headers: { 'Content-Type': 'application/json' },
});

// token store (kept module-local; AuthContext will keep it in memory too)
let accessToken = null;
export function setAccessToken(token) { accessToken = token; }
export function clearAccessToken() { accessToken = null; }

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // Retry on 401 only once
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data?.accessToken;
        setAccessToken(newToken);
        isRefreshing = false;
        onRefreshed(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        isRefreshing = false;
        refreshQueue = [];
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

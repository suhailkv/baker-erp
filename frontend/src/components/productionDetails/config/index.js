// src/components/productionDetails/config/index.js
export const API_ENDPOINTS = {
  PRODUCTION_DETAILS: (id) => `/productions/${id}`,
  UPDATE_STATUS: (id) => `/productions/${id}/status`,
};

export const PRODUCTION_STATUSES = {
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

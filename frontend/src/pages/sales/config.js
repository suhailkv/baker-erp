export const API_ENDPOINTS = {
  list: "/sales",
  create: "/sales",
  update: (id) => `/sales/${id}`,
  delete: (id) => `/sales/${id}`,
  updateStatus: (id) => `/sales/${id}/status`,
  invoice: (id) => `/sales/${id}/invoice`,
  export: (format) => `/sales/bulk-export?format=${format}`,
  import: "/sales/bulk-import",
};

export const SALE_STATUSES = {
  PAID: "PAID",
  CANCELLED: "CANCELLED",
};

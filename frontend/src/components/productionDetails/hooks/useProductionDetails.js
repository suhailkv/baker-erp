import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { API_ENDPOINTS } from "../config";

export const useProductionDetails = ({ open, productionId, onStatusUpdated }) => {
  const [production, setProduction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  // Fetch production details
  useEffect(() => {
    if (!open || !productionId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(API_ENDPOINTS.PRODUCTION_DETAILS(productionId));
        setProduction(data);
      } catch (e) {
        console.error("Failed to fetch production:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, productionId]);

  // Change status
  const changeStatus = async (newStatus) => {
    if (!production) return;
    setStatusChanging(true);
    try {
      const { data } = await api.patch(API_ENDPOINTS.UPDATE_STATUS(production.id), { status: newStatus });
      setProduction(data);
      onStatusUpdated && onStatusUpdated(data);
    } catch (e) {
      console.error("Failed to update status:", e);
      alert(e?.response?.data?.error || "Failed to update status");
    } finally {
      setStatusChanging(false);
    }
  };

  return { production, loading, statusChanging, changeStatus };
};

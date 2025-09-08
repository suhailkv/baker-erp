import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useProductionDetails } from "./hooks/useProductionDetails";
import { PRODUCTION_STATUSES } from "./config";
import BatchInfo from "./components/BatchInfo";
import RawMaterialsTable from "./components/RawMaterialsTable";

const ProductionDetails = ({ open, onClose, productionId, onStatusUpdated }) => {
  const { production, loading, statusChanging, changeStatus } = useProductionDetails({
    open,
    productionId,
    onStatusUpdated,
  });

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>Production Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading…</Typography>
        ) : !production ? (
          <Typography>No data available</Typography>
        ) : (
          <Stack spacing={2}>
            <BatchInfo production={production} />
            <RawMaterialsTable rawMaterials={production.ProductionRawMaterials} />
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Close</Button>

        {production?.status !== PRODUCTION_STATUSES.COMPLETED && (
          <Button
            variant="contained"
            onClick={() => changeStatus(PRODUCTION_STATUSES.COMPLETED)}
            disabled={statusChanging}
          >
            Mark Completed
          </Button>
        )}

        {production?.status !== PRODUCTION_STATUSES.CANCELLED && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              if (
                !window.confirm(
                  "Cancel production and restore used raw material stock?"
                )
              )
                return;
              changeStatus(PRODUCTION_STATUSES.CANCELLED);
            }}
            disabled={statusChanging}
          >
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductionDetails;

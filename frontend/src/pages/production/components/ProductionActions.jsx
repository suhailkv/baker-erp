import React from "react";
import { Stack, Button } from "@mui/material";
import { PRODUCTION_STATUSES } from "../config/productionConfig";

const ProductionActions = ({ row, onDetails, onComplete, onCancel }) => (
    <Stack direction="row" spacing={1}>
        <Button size="small" onClick={() => onDetails(row.id)}>Details</Button>
        {row.status !== PRODUCTION_STATUSES.COMPLETED && (
            <Button size="small" onClick={() => onComplete(row.id)}>Complete</Button>
        )}
        {row.status !== PRODUCTION_STATUSES.CANCELLED && (
            <Button size="small" color="error" onClick={() => onCancel(row.id)}>
                Cancel
            </Button>
        )}
    </Stack>
);

export default ProductionActions;

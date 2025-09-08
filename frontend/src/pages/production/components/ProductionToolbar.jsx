import React from "react";
import { Stack, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ProductionToolbar = ({ onCreate }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>Production</Typography>
            <Button startIcon={<AddIcon />} variant="contained" onClick={onCreate}>
                New Batch
            </Button>
        </Stack>
    </Paper>
);

export default ProductionToolbar;

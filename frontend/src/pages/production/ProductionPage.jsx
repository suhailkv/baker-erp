import React, { useState } from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../../components/common/DataTable";
import ProductionForm from "../../components/production/ProductionForm";
import ProductionDetails from "../../components/productionDetails/ProductionDetails";
import { useProductions } from "../production/hooks/useProductions";

export default function Production() {
    const [createOpen, setCreateOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedProductionId, setSelectedProductionId] = useState(null);

    const { fetchProductions, updateStatus, refreshKey, refresh } = useProductions();

    const handleDetails = (id) => {
        setSelectedProductionId(id);
        setDetailsOpen(true);
    };

    const handleComplete = async (id) => {
        try {
            await updateStatus(id, "COMPLETED");
        } catch {
            alert("Failed to complete");
        }
    };

    const handleCancel = async (id) => {
        if (!confirm("Cancel production and restore stocks?")) return;
        try {
            await updateStatus(id, "CANCELLED");
        } catch {
            alert("Failed to cancel");
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "batch_code", headerName: "Batch Code", width: 180 },
        { field: "productName", headerName: "Product", flex: 1 },
        // { field: "quantity", headerName: "Quantity", width: 120 },
        { field: "status", headerName: "Status", width: 140 },
        { field: "stock", headerName: "Stock", width: 140 },
        {
            field: "actions",
            headerName: "Actions",
            width: 220,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleDetails(params.row.id)}>
                        Details
                    </Button>
                    <Button size="small" onClick={() => handleComplete(params.row.id)}>
                        Complete
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancel(params.row.id)}
                    >
                        Cancel
                    </Button>
                </Stack>
            ),
        },
    ];

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={700}>
                        Production
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => setCreateOpen(true)}
                    >
                        New Batch
                    </Button>
                </Stack>
            </Paper>

            <DataTable
                key={refreshKey}
                columns={columns}
                fetchData={fetchProductions}
                initialPageSize={10}
            />


            <ProductionForm
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    refresh(); 
                    setCreateOpen(false);
                }}
            />


            <ProductionDetails
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                productionId={selectedProductionId}
                onStatusUpdated={() => { }}
            />
        </Box>
    );
}

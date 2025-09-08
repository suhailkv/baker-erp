import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import { useProductionForm } from "./hooks/useProductionForm";
import { useRawMaterials } from "./hooks/useRawMaterials";
import { useProducts } from "./hooks/useProducts";
import ProductNameAutocomplete from "./components/ProductNameAutocomplete";
import ProductionDetailsFields from "./components/ProductionDetailsFields";
import RawMaterialsTable from "./components/RawMaterialsTable";

const ProductionForm = ({ open, onClose, onCreated }) => {
    const { materials } = useRawMaterials(open);
    const { products, addProduct } = useProducts(open);
    const { formData, setFormData, loading, error, addRow, removeRow, updateRow, handleSubmit } = useProductionForm({ onCreated, onClose });

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>Create Production Batch</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {error && <Typography color="error">{error}</Typography>}

                    <ProductNameAutocomplete
                        value={formData.product}
                        onChange={(product) => setFormData((p) => ({ ...p, product }))}
                        products={products}
                        addProduct={addProduct}
                    />

                    <ProductionDetailsFields
                        quantity={formData.quantity}
                        unit={formData.unit}
                        setFormData={setFormData}
                    />

                    <RawMaterialsTable
                        rows={formData.rawMaterials}
                        materials={materials}
                        addRow={addRow}
                        removeRow={removeRow}
                        updateRow={updateRow}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button
                    onClick={() => handleSubmit(materials)}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Creating…" : "Create Batch"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductionForm;

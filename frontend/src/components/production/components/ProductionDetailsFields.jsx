import { Stack, TextField } from "@mui/material";

const ProductionDetailsFields = ({ quantity, unit, setFormData }) => (
    <Stack direction="row" spacing={2}>
        <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setFormData((p) => ({ ...p, quantity: e.target.value }))}
        />
        <TextField
            label="Unit"
            value={unit}
            onChange={(e) => setFormData((p) => ({ ...p, unit: e.target.value }))}
        />
    </Stack>
);

export default ProductionDetailsFields;

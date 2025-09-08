import { Autocomplete, TextField, Stack, Typography, IconButton, Button } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";

const RawMaterialsTable = ({
    rows,
    materials,
    addRow,
    removeRow,
    updateRow,
}) => (
    <Stack spacing={1}>
        {rows.map((row, idx) => (
            <Stack
                key={idx}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ width: "100%" }}
            >
                <Autocomplete
                    sx={{ flex: 1 }}
                    getOptionLabel={(opt) => opt?.name || ""}
                    options={materials}
                    value={materials.find((m) => m.id === row.rawMaterialId) || null}
                    onChange={(_, v) =>
                        updateRow(idx, {
                            rawMaterialId: v ? v.id : null,
                            name: v ? v.name : "",
                        })
                    }
                    renderInput={(params) => <TextField {...params} label="Material" />}
                />
                <TextField
                    sx={{ width: 140 }}
                    label="Used Qty"
                    type="number"
                    value={row.usedQty}
                    onChange={(e) => updateRow(idx, { usedQty: e.target.value })}
                />
                <Typography sx={{ minWidth: 120 }} color="text.secondary">
                    {row.rawMaterialId
                        ? (() => {
                            const mat = materials.find((m) => m.id === row.rawMaterialId);
                            return `Stock: ${mat ? mat.stock : "—"}`;
                        })()
                        : ""}
                </Typography>
                <IconButton
                    color="error"
                    onClick={() => removeRow(idx)}
                    disabled={rows.length === 1}
                >
                    <RemoveCircleOutline />
                </IconButton>
            </Stack>
        ))}
        <Button
            startIcon={<AddCircleOutline />}
            onClick={addRow}
            variant="outlined"
        >
            Add material
        </Button>
    </Stack>
);

export default RawMaterialsTable;

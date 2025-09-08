import { useState } from "react";
import { api } from "../../../lib/api";
import { DEFAULT_FORM } from "../config";

export const useProductionForm = ({ onCreated, onClose }) => {
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => setFormData(DEFAULT_FORM);

    const addRow = () =>
        setFormData((prev) => ({
            ...prev,
            rawMaterials: [
                ...prev.rawMaterials,
                { rawMaterialId: null, name: "", usedQty: 0 },
            ],
        }));

    const removeRow = (idx) =>
        setFormData((prev) => ({
            ...prev,
            rawMaterials: prev.rawMaterials.filter((_, i) => i !== idx),
        }));

    const updateRow = (idx, patch) =>
        setFormData((prev) => ({
            ...prev,
            rawMaterials: prev.rawMaterials.map((r, i) =>
                i === idx ? { ...r, ...patch } : r
            ),
        }));

    const handleSubmit = async (materialsList) => {
        setError("");
        try {
            if (!formData.product) throw new Error("Product required");
            if (!formData.quantity || Number(formData.quantity) <= 0)
                throw new Error("Quantity must be > 0");

            const rawMaterials = formData.rawMaterials
                .filter((r) => r.rawMaterialId)
                .map((r) => ({
                    rawMaterialId: r.rawMaterialId,
                    usedQty: Number(r.usedQty),
                }));

            if (!rawMaterials.length)
                throw new Error("At least one raw material must be selected");

            for (const r of rawMaterials) {
                const mat = materialsList.find((m) => m.id === r.rawMaterialId);
                if (!mat) throw new Error(`Material ${r.rawMaterialId} not found`);
                if (r.usedQty > mat.stock)
                    throw new Error(
                        `Insufficient stock for ${mat.name} (available ${mat.stock})`
                    );
            }

            setLoading(true);
            const payload = {
                product_id: formData.product.id,
                product_name: formData.product.name,
                quantity: Number(formData.quantity),
                unit: formData.unit,
                rawMaterials,
            };

            await api.post("/productions", payload);
            setLoading(false);

            onCreated && onCreated();
            onClose(true);
            resetForm();
        } catch (err) {
            setLoading(false);
            setError(err?.response?.data?.error || err.message || "Failed to create");
        }
    };

    return { formData, setFormData, loading, error, resetForm, addRow, removeRow, updateRow, handleSubmit };
};

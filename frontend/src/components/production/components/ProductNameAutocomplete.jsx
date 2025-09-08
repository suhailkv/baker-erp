import React, { useState } from "react";
import { Autocomplete, TextField, IconButton } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

const ProductNameAutocomplete = ({ value, onChange, products, addProduct }) => {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = async () => {
        if (!inputValue.trim()) return;
        try {
            const newProduct = await addProduct(inputValue.trim());
            onChange(newProduct); 
            setInputValue("");
        } catch (err) {
            console.error("Failed to add product:", err);
        }
    };

    return (
        <Autocomplete
            fullWidth
            options={products}
            getOptionLabel={(opt) => opt?.name || ""}
            value={value || null} 
            onChange={(_, newValue) => {
                onChange(newValue); 
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Product name"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                <IconButton onClick={handleAdd}>
                                    <AddCircleOutline />
                                </IconButton>
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default ProductNameAutocomplete;

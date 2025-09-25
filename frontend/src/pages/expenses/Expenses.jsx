import React, { useState } from "react";
import { Box } from "@mui/material";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseToolbar from "./components/ExpenseToolbar";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "../../components/expenses/expenseForm/ExpenseForm";

const Expenses = () => {
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { rows, loading, saveExpense, deleteExpense, exportExpenses, importExpenses } = useExpenses(search);

    const handleSave = async (data) => {
        await saveExpense(data, editData?.id);
        setFormOpen(false);
        setEditData(null);
    };

    return (
        <Box>
            <ExpenseToolbar
                search={search}
                setSearch={setSearch}
                onAdd={() => setFormOpen(true)}
                onExport={exportExpenses}
                onImport={importExpenses}
            />

            <ExpenseTable
                rows={rows}
                loading={loading}
                onEdit={(row) => {
                    setEditData(row);
                    setFormOpen(true);
                }}
                onDelete={deleteExpense}
            />

            <ExpenseForm
                open={formOpen}
                handleClose={() => {
                    setFormOpen(false);
                    setEditData(null);
                }}
                handleSave={handleSave}
                initialData={editData}
            />
        </Box>
    );
};

export default Expenses;

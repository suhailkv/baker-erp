// src/pages/users/Users.jsx
import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "../../lib/api";
import UserForm from "./components/UserForm";

const Users = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", { params: { search } });
      const data = res.data.rows || res.data || [];

      const formatted = data.map((u) => ({
        id: u.id,
        email: u.email,
        roles: u.Roles?.map((r) => r.name).join(", ") || "—",
      }));

      setRows(formatted);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleSave = async (formData) => {
    try {
      if (editData) {
        await api.put(`/users/${editData.id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      fetchData();
      setFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "roles", headerName: "Roles", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setEditData(params.row);
              setFormOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Add User
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />

      <UserForm
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

export default Users;

// src/components/forms/UserForm.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Autocomplete,
} from "@mui/material";
import { api } from "../../../lib/api";

const UserForm = ({ open, handleClose, handleSave, initialData }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roleIds: [],
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        password: "",
        roleIds: initialData.roles
          ? initialData.roles.split(",").map((r) => {
              const found = roles.find((role) => role.name === r.trim());
              return found ? found.id : null;
            }).filter(Boolean)
          : [],
      });
    } else {
      setFormData({ email: "", password: "", roleIds: [] });
    }
  }, [initialData, roles]);

  const onSave = () => {
    if (!formData.email) {
      alert("Email is required");
      return;
    }
    if (!initialData && !formData.password) {
      alert("Password is required for new users");
      return;
    }
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{initialData ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
          />
          {!initialData && (
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
            />
          )}
          <Autocomplete
            multiple
            options={roles}
            value={roles.filter((r) => formData.roleIds.includes(r.id))}
            getOptionLabel={(option) => option.name}
            onChange={(e, newValue) =>
              setFormData({ ...formData, roleIds: newValue.map((r) => r.id) })
            }
            renderInput={(params) => (
              <TextField {...params} label="Roles" placeholder="Select roles" />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {initialData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;

import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Select,
  } from "@mui/material";

const AddUserModal = ({open,handleAddUserClose,handleInputChange,handleAddUserSubmit,newUser}) => {
  return (
    <Dialog open={open} onClose={handleAddUserClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <TextField
          name="username"
          label="Username"
          value={newUser.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="first_name"
          label="First Name"
          value={newUser.first_name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="last_name"
          label="Last Name"
          value={newUser.last_name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={newUser.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={newUser.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <Select
          labelId="role-select-label"
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          fullWidth
          required
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddUserClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddUserSubmit} color="primary">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;

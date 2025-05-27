import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField,} from "@mui/material";
import {CustomButton} from "../../../../common/components/CustomButton.jsx";

const AddUserModal = ({open, handleAddUserClose, handleInputChange, handleAddUserSubmit, newUser}) => {
    return (
        <Dialog open={open} onClose={handleAddUserClose}>
            <DialogTitle
                sx={{fontWeight: "bold"}}
            >
                Add User
            </DialogTitle>
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
            <DialogActions
                sx={{
                    paddingX: "24px",
                    paddingBottom: "12px",
                }}
            >
                <CustomButton
                    onClick={handleAddUserClose}
                    color="danger"
                    title="Cancel"
                />
                <CustomButton
                    onClick={handleAddUserSubmit}
                    color="success"
                    title="Add User"
                />

            </DialogActions>
        </Dialog>
    );
};

export default AddUserModal;

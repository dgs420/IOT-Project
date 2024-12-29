import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getRequest, postRequest, deleteRequest } from "../../../api/index.js"; // Ensure your API functions are defined
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField,Select} from "@mui/material";
import {toast} from "react-toastify";
// import {Select} from "antd";

function UserList(props) {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false); // For Add User Dialog
    const [newUser, setNewUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role: ''
    });

    // Fetch all users
    const getAllUsers = async () => {
        try {
            const response = await getRequest('/user/all-user'); // Adjust URL as needed
            if (response.code === 200) {
                setUsers(response.info);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {


        getAllUsers();
    }, []);

    // Open Add User Dialog
    const handleAddUserOpen = () => {
        setOpen(true);
    };

    // Close Add User Dialog
    const handleAddUserClose = () => {
        setOpen(false);
        setNewUser({
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            role: ''
        });
    };

    // Handle input changes for Add User
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    // Submit Add User Form
    const handleAddUserSubmit = async () => {
        if (!newUser.username || !newUser.email || !newUser.role || !newUser.password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const response = await postRequest('/auth/signup', newUser); // Adjust API endpoint as needed
            if (response.code === 200) {
                getAllUsers();
                toast.success("New user created");// Add new user to the state
                handleAddUserClose();
            } else {
                toast.error(response.message);
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // Handle Delete User
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await deleteRequest(`/user/${userId}`); // Adjust API endpoint as needed
                if (response.code === 200) {
                    toast.success("User deleted");
                    getAllUsers(); // Remove user from the state
                } else {
                    toast.error(response.message);
                    console.error(response.message);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className='px-4 py-4'>
            <div className="bg-white rounded-lg shadow border">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-semibold">All Users</h2>
                    <div className="mx-1">
                        <Button variant="contained" color="primary" onClick={handleAddUserOpen}>
                            Add User
                        </Button>
                    </div>
                </div>
                <table className="min-w-full bg-white border-gray-300">
                    <thead className='top-0 sticky'>
                    <tr className="bg-gray-100 text-gray-600">
                        <th className="py-3 px-4 border-b">#</th>
                        <th className="py-3 px-4 border-b">Username</th>
                        <th className="py-3 px-4 border-b">Firstname</th>
                        <th className="py-3 px-4 border-b">Lastname</th>
                        <th className="py-3 px-4 border-b">Email</th>
                        <th className="py-3 px-4 border-b">Role</th>
                        <th className="py-3 px-4 border-b">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.user_id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b text-center">{user.username}</td>
                            <td className="py-2 px-4 border-b text-center">{user.first_name}</td>
                            <td className="py-2 px-4 border-b text-center">{user.last_name}</td>
                            <td className="py-2 px-4 border-b text-center">{user.email}</td>
                            <td className="py-2 px-4 border-b text-center">{user.role}</td>
                            <td className="py-2 px-4 border-b text-center flex justify-between">
                                <Link className="py-2 text-center font-medium text-blue-500" to={`/user/${user.user_id}`}>
                                    Detail
                                </Link>
                                <span
                                    className="py-2 text-center font-medium text-red-500 cursor-pointer"
                                    onClick={() => handleDeleteUser(user.user_id)}
                                >
                                    Delete
                                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Dialog */}
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
        </div>
    );
}

export default UserList;

import React, { useEffect, useState } from "react";
import { postRequest, deleteRequest } from "../../../api/index.js"; // Ensure your API functions are defined
import { toast } from "react-toastify";
import { fetchData } from "../../../api/fetchData.js";
import UserFilterBar from "./components/UserFilterBar.jsx";
import PageContentHeader from "../../../common/components/PageContentHeader.jsx";
import AddUserModal from "./components/AddUserModal.jsx";
import {Box} from "@mui/material"
import UsersTable from "./components/UsersTable.jsx";
import {Modal as AntModal} from "antd";

function UserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    void fetchData("/user/all-user", setUsers);
  }, []);

  const filteredUsers= users.filter(user => {
    const matchesSearch =
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ;

    const matchesStatus = roleFilter === 'all' || user.role === roleFilter;

    return (searchQuery === '' || matchesSearch) && matchesStatus;
});

  const handleAddUserOpen = () => {
    setOpen(true);
  };

  // Close Add User Dialog
  const handleAddUserClose = () => {
    setOpen(false);
    setNewUser({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      role: "",
    });
  };

  // Handle input changes for Add User
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Add User Form
  const handleAddUserSubmit = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.role ||
      !newUser.password
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await postRequest("/auth/create-user", newUser);
      if (response.code === 200) {
        void fetchData("/user/all-user", setUsers);
        toast.success("New user created");
        handleAddUserClose();
      } else {
        toast.error(response.message);
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleDeleteUser = async (userId) => {
    AntModal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this user?',
      onOk: async () => {
        try {
          const response = await deleteRequest(`/user/${userId}`);
          if (response.code === 200) {
            toast.success("User deleted");
            void fetchData("/user/all-user", setUsers);
          } else {
            toast.error(response.message);
            console.error(response.message);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      },
      onCancel() {
        // console.log('Device deletion cancelled');
      },
    });
  };
  
  return (
    <Box>
        <PageContentHeader
          onClick={handleAddUserOpen}
          label="All Users"
          description={"Manger all users"}
          buttonLabel={"Add user"}
          className='mb-4'
        />

        <UserFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      <UsersTable
        users={filteredUsers}
        handleDeleteUser={handleDeleteUser}
      />

      <AddUserModal
        open={open}
        handleAddUserClose={handleAddUserClose}
        handleInputChange={handleInputChange}
        handleAddUserSubmit={handleAddUserSubmit}
        newUser={newUser}
      />
    </Box>
  );
}

export default UserList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postRequest, deleteRequest } from "../../../api/index.js"; // Ensure your API functions are defined
import { toast } from "react-toastify";
import { fetchData } from "../../../api/fetchData.js";
import UserFilterBar from "./UserFilterBar.jsx";
import PageContentHeader from "../../../common/components/PageContentHeader.jsx";
import AddUserModal from "./AddUserModal.jsx";
// import {Select} from "antd";

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
    if (window.confirm("Are you sure you want to delete this user?")) {
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
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow border">
        <PageContentHeader
          onClick={handleAddUserOpen}
          label="All Users"
          description={"Manger all users"}
          buttonLabel={"Add user"}
        />

        <UserFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <table className="min-w-full bg-white border-gray-300">
          <thead className="top-0 sticky">
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
            {filteredUsers.map((user, index) => (
              <tr key={user.user_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center">
                  {user.username}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {user.first_name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {user.last_name}
                </td>
                <td className="py-2 px-4 border-b text-center">{user.email}</td>
                <td className="py-2 px-4 border-b text-center">{user.role}</td>
                <td className="py-2 px-4 border-b text-center flex justify-between">
                  <Link
                    className="py-2 text-center font-medium text-blue-500"
                    to={`/user/${user.user_id}`}
                  >
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

      <AddUserModal
        open={open}
        handleAddUserClose={handleAddUserClose}
        handleInputChange={handleInputChange}
        handleAddUserSubmit={handleAddUserSubmit}
        newUser={newUser}
      />
    </div>
  );
}

export default UserList;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import { TablePagination } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";

const UsersTable = ({ users, handleDeleteUser }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="min-w-full bg-white">
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
          {users
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user, index) => (
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
                    <IconButton color="primary">
                      <Edit size={18} />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user.user_id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[6, 12, 24]}
      />
    </div>
  );
};

export default UsersTable;

import React from "react";
import {Link} from "react-router-dom";

const UsersTable = ({
                        users, handleDeleteUser
                    }) => {
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
                {users.map((user, index) => (
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
    );
};

export default UsersTable;

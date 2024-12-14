import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {getRequest} from "../../api/index.js";
import {Button} from "@mui/material";

function UserList(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        const getAllUsers = async () => {
            try {
                const response = await getRequest('/user/all-user'); // Adjust URL as needed
                if (response.code === 200) {
                    setUsers(response.info);
                } else {
                    console.error(response.message);
                }
                // Set the fetched data to the logs state
            } catch (error) {
                console.error('Error fetching traffic logs:', error);
            }
        };

        getAllUsers();
        // setInterval(getTrafficLogs)

    }, []);
    return (
        <div className='px-4 py-4'>
            <div className="bg-white rounded-lg shadow border">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-semibold">All User</h2>
                    <div className="mx-1">
                        <Button variant="contained" color="primary">
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
                        <tr key={user.user_id} className="hover:bg-gray-100 ">
                            <td className="py-2 px-4 border-b text-center">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b text-center">{user.username}</td>
                            <td className="py-2 px-4 border-b text-center">{user.first_name}</td>
                            <td className="py-2 px-4 border-b text-center">{user.last_name}</td>
                            <td className="py-2 px-4 border-b text-center">{user.email}</td>
                            <td className="py-2 px-4 border-b text-center">{user.role}</td>
                            <td className="py-2 px-4 border-b text-center flex justify-between">
                                <Link
                                    className="py-2 text-center font-medium text-blue-500 "
                                    to={`/user/${user.user_id}`}>
                                    Detail
                                </Link>

                                <Link
                                    className="py-2 text-center font-medium text-red-600 px-1"
                                    to={`/user/${user.user_id}`}>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>

    );
}

export default UserList;
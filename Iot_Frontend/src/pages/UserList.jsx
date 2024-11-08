import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

function UserList(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        const getAllUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/all-user'); // Adjust URL as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch logs');
                }
                const data = await response.json();
                setUsers(data); // Set the fetched data to the logs state
            } catch (error) {
                console.error('Error fetching traffic logs:', error);
            }
        };

        getAllUsers();
        // setInterval(getTrafficLogs)

    }, []);
    return (
        <div className="overflow-x-auto h-96">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                <thead className='top-0 sticky'>
                <tr className="bg-gray-100 text-gray-600">
                    <th className="py-3 px-4 border-b">User ID</th>
                    <th className="py-3 px-4 border-b">Username</th>
                    <th className="py-3 px-4 border-b">Firstname</th>
                    <th className="py-3 px-4 border-b">Lastname</th>
                    <th className="py-3 px-4 border-b">Email</th>
                    <th className="py-3 px-4 border-b">Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-100 ">
                        <td className="py-2 px-4 border-b text-center">
                            <Link
                                to={`/user/${user.user_id}`}>
                                {user.user_id}
                            </Link>
                        </td>
                        <td className="py-2 px-4 border-b text-center">{user.username}</td>
                        <td className="py-2 px-4 border-b text-center">{user.first_name}</td>
                        <td className="py-2 px-4 border-b text-center">{user.last_name}</td>
                        <td className="py-2 px-4 border-b text-center">{user.email}</td>
                        <td className="py-2 px-4 border-b text-center">{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import {getRequest} from "../../../../api/index.js";

export const UserLog = ({ userId }) => {
    const [logs, setLogs] = useState([]);

    // Fetch user logs
    const getUserLogs = async () => {
        try {
            const response = await getRequest(`/logs/logs-by-user/${userId}`);
            if (response.code === 200) {
                setLogs(response.info); // Assuming the response structure
            } else {
                toast.error(response.message);
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching user logs:', error);
        }
    };

    useEffect(() => {
        getUserLogs();
    }, [userId]);

    return (
        <div className="bg-white rounded-lg shadow border px-4 py-4">
            <h2 className="text-xl font-semibold pb-4">User History</h2>
            {/* Logs Table */}
            <div className="overflow-x-auto" style={{maxHeight: '400px', overflowY: 'auto'}}>
                <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                    <thead className='top-0 sticky'>
                    <tr className="bg-gray-100 text-gray-600">
                        <th className="py-3 px-4 border-b">Log ID</th>
                        <th className="py-3 px-4 border-b">Time</th>
                        <th className="py-3 px-4 border-b">Action</th>
                        <th className="py-3 px-4 border-b">Card Number</th>
                        <th className="py-3 px-4 border-b">Vehicle Number</th>
                        <th className="py-3 px-4 border-b">Vehicle Type</th>
                        <th className="py-3 px-4 border-b">Gate ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.log_id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">{log.log_id}</td>
                            <td className="py-2 px-4 border-b text-center">{new Date(log.time).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b text-center">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            log.action.includes('enter')
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {log.action}
                                    </span>
                            </td>
                            <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.card_number : 'N/A'}</td>
                            <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.vehicle_number : 'N/A'}</td>
                            <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.vehicle_type : 'N/A'}</td>
                            <td className="py-2 px-4 border-b text-center">{log.device_id ? (
                                    <Link to={`/device/${log.device_id}`}>
                                        {log.device_id}
                                    </Link>)
                                : 'N/A'}
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {getRequest} from "../../../api/index.js";


export const ActivityLog = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {

        const getTrafficLogs = async () => {
            try {
                const response = await getRequest('/logs/all-logs-details'); // Adjust URL as needed
                if(response.code === 200){
                    setLogs(response.info);
                    console.log(response);
                }else{
                    console.error(response.message);
                }
            } catch (error) {
                console.error('Error fetching traffic logs:', error);
            }
        };

        getTrafficLogs();
        // setInterval(getTrafficLogs)

    }, []);
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                <thead className='top-0 sticky'>
                <tr className="bg-gray-100 text-gray-600">
                    <th className="py-3 px-4 border-b">Log ID</th>
                    <th className="py-3 px-4 border-b">Card ID</th>
                    <th className="py-3 px-4 border-b">Time</th>
                    <th className="py-3 px-4 border-b">Action</th>
                    <th className="py-3 px-4 border-b">Card Number</th>
                    <th className="py-3 px-4 border-b">Vehicle Number</th>
                    <th className="py-3 px-4 border-b">Vehicle Type</th>
                    <th className="py-3 px-4 border-b">Gate ID</th>
                    <th className="py-3 px-4 border-b">User ID</th>
                    <th className="py-3 px-4 border-b">Username</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((log) => (
                    <tr key={log.log_id} className="hover:bg-gray-100 ">
                        <td className="py-2 px-4 border-b text-center">{log.log_id}</td>
                        <td className="py-2 px-4 border-b text-center">{log.card_id}</td>
                        <td className="py-2 px-4 border-b text-center">{new Date(log.time).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-center">{log.action}</td>
                        <td className="py-2 px-4 border-b text-center">{log.rfid_card.card_number}</td>
                        <td className="py-2 px-4 border-b text-center">{log.rfid_card.vehicle_number}</td>
                        <td className="py-2 px-4 border-b text-center">{log.rfid_card.vehicle_type}</td>
                        <td className="py-2 px-4 border-b text-center">{log.device_id}</td>
                        <td className="py-2 px-4 border-b text-center">
                            <Link
                                to={`/user/${log.rfid_card.user.user_id}`}>
                                {log.rfid_card.user.user_id}
                            </Link>
                        </td>
                        <td className="py-2 px-4 border-b text-center">{log.rfid_card.user.username}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

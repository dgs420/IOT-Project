import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {getRequest} from "../../../api/index.js";
import jsPDF from "jspdf";
import {toast} from "react-toastify";
import "jspdf-autotable";
import {Button} from "@mui/material";

export const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState([]);

    const pageSize = 10; // Number of logs per page

    const getAllLogs = async () => {
        try {
            const response = await getRequest(`/logs/all-logs-details?all=true&startDate=${startDate}&endDate=${endDate}`);
            if (response.code === 200) {
                return response.info.logs; // Return all logs
            } else {
                toast.error(response.message);
                console.error(response.message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching all traffic logs:', error);
            return [];
        }
    };


    const getPaginatedLogs = async () => {
        try {
            const response = await getRequest(
                `/logs/all-logs-details?page=${page}&size=${pageSize}&startDate=${startDate}&endDate=${endDate}`
            ); // Adjust URL as needed
            if (response.code === 200) {
                setLogs(response.info.logs);
                setTotalPages(response.info.pagination.totalPages); // Assuming backend provides total pages
            } else {
                toast.error(response.message);
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching traffic logs:', error);
        }
    };

    const saveToPDF = async () => {
        const allLogs = await getAllLogs(); // Fetch all logs

        if (allLogs.length === 0) {
            toast.error("No logs available to export.");
            return;
        }

        const doc = new jsPDF();
        doc.text("Activity Log Report", 14, 10);
        doc.autoTable({
            head: [
                [
                    "Log ID", "Card ID", "Time", "Action", "Card Number",
                    "Vehicle Number", "Vehicle Type", "Gate ID", "User ID", "Username"
                ]
            ],
            body: allLogs.map(log => [
                log.log_id,
                log.card_id,
                new Date(log.time).toLocaleString(),
                log.action,
                log.rfid_card?.card_number || "N/A",
                log.rfid_card?.vehicle_number || "N/A",
                log.rfid_card?.vehicle_type || "N/A",
                log.device_id,
                log.rfid_card?.user?.user_id || "N/A",
                log.rfid_card?.user?.username || "N/A"
            ]),
        });
        doc.save("Activity_Log_Report_All.pdf");
    };

    useEffect(() => {
        getPaginatedLogs();
    }, [page, startDate, endDate]);

    return (
        <div>
            <div className="bg-white rounded-lg shadow border px-4 py-4">
                {/* Date Range Filter */}
                <div className="flex items-center justify-between mb-4 space-x-4">
                    <div className="flex items-center">
                        <label htmlFor="startDate" className="mb-1 mr-4 font-semibold text-gray-700">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="endDate" className="mb-1 mr-4 font-semibold text-gray-700">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <Button variant="contained" color="primary" onClick={saveToPDF}>
                        Save to PDF
                    </Button>
                </div>

                {/* Logs Table */}
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
                            <tr key={log.log_id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-center">{log.log_id}</td>
                                <td className="py-2 px-4 border-b text-center">{log.card_id}</td>
                                <td className="py-2 px-4 border-b text-center">{new Date(log.time).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b text-center">{log.action}</td>
                                <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.card_number : 'N/A'}</td>
                                <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.vehicle_number : 'N/A'}</td>
                                <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.vehicle_type : 'N/A'}</td>
                                <td className="py-2 px-4 border-b text-center">{log.device ? (
                                        <Link to={`/device/${log.device.embed_id}`}>
                                            {log.device.embed_id}
                                        </Link>)
                                    : 'N/A'}

                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {log.rfid_card && log.rfid_card.user ? (
                                        <Link to={`/user/${log.rfid_card.user.user_id}`}>
                                            {log.rfid_card.user.user_id}
                                        </Link>
                                    ) : 'N/A'}
                                </td>
                                <td className="py-2 px-4 border-b text-center">{log.rfid_card ? log.rfid_card.user.username : 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-1">
                    {/* Previous Button */}
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 rounded-l disabled:bg-gray-300"
                    >
                        Previous
                    </button>

                    {/* Numbered Page Buttons */}
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-4 py-2 ${
                                page === pageNumber ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-r disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

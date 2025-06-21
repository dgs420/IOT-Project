import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRequest } from "../../../api/index.js";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import "jspdf-autotable";
import { Button } from "@mui/material";
import ActivityLog from "@/pages/Home/Components/ActivityLog.jsx";
import ActivityList from "@/common/components/ActivityTable.jsx";

export const LogHistory = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);

  const pageSize = 10;

  const getAllLogs = async () => {
    try {
      const response = await getRequest(
        `/logs/all-logs-details?all=true&startDate=${startDate}&endDate=${endDate}`
      );
      if (response.code === 200) {
        return response.info.logs; // Return all logs
      } else {
        toast.error(response.message);
        console.error(response.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching all traffic logs:", error);
      return [];
    }
  };

  // const getPaginatedLogs = async () => {
  //     try {
  //         const response = await getRequest(
  //             `/logs/all-logs-details?page=${page}&size=${pageSize}&startDate=${startDate}&endDate=${endDate}`
  //         ); // Adjust URL as needed

  //         if (response.code === 200) {
  //             setLogs(response.info.logs);
  //             setTotalPages(response.info.pagination.totalPages);
  //         } else {
  //             toast.error(response.message);
  //             console.error(response.message);
  //         }
  //     } catch (error) {
  //         console.error('Error fetching traffic logs:', error);
  //     }
  // };

  // const saveToPDF = async () => {
  //     const allLogs = await getAllLogs(); // Fetch all logs

  //     if (allLogs.length === 0) {
  //         toast.error("No logs available to export.");
  //         return;
  //     }

  //     const doc = new jsPDF();
  //     doc.text("Activity Log Report", 14, 10);
  //     doc.autoTable({
  //         head: [
  //             [
  //                 "Log ID", "Time", "Action", "Card Number",
  //                 "Vehicle Number", "Vehicle Type", "Gate ID", "User ID", "Username"
  //             ]
  //         ],
  //         body: allLogs.map(log => [
  //             log.log_id,
  //             new Date(log.time).toLocaleString(),
  //             log.action,
  //             log.rfid_card?.card_number || "N/A",
  //             log.rfid_card?.Vehicle?.vehicle_number || "N/A",  // Use "Vehicle" with uppercase "V"
  //             log.rfid_card?.Vehicle?.vehicle_type || "N/A",    // Make sure vehicle_type exists
  //             log.device_id,
  //             log.rfid_card?.Vehicle?.user_id || "N/A",
  //         ]),
  //     });
  //     doc.save("Activity_Log_Report_All.pdf");
  // };

  // useEffect(() => {
  //     getPaginatedLogs();
  // }, [page, startDate, endDate]);

  return (
    <div>
      <ActivityList embedId={null} />
    </div>
  );
};

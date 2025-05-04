import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { getRequest } from "../../../../api/index.js";
import { fetchData } from "../../../../api/fetchData.js";

export const UserLog = ({ userId }) => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    fetchData(`/session/user-sessions/${userId}`, setSessions, null, null);
  }, [userId]);

  return (
    <div className="bg-white rounded-lg shadow border px-4 py-4">
      <h2 className="text-xl font-semibold pb-4">User History</h2>
      <div
        className="overflow-x-auto"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className="top-0 sticky">
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-3 px-4 border-b">Vehicle Number</th>
              <th className="py-3 px-4 border-b">Entry time</th>
              <th className="py-3 px-4 border-b">Exit time</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Payment status</th>
              <th className="py-3 px-4 border-b">Fee</th>
              {/* <th className="py-3 px-4 border-b">Gate ID</th> */}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.session_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-center">
                  {session.Vehicle.vehicle_number}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {new Date(session.entry_time).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {!session.exit_time
                    ? "---"
                    : new Date(session.exit_time).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      session.status.includes("completed")
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {session.payment_status}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {session.fee}
                </td>
                {/* <td className="py-2 px-4 border-b text-center">
                  {session.Vehicle.vehicle_number}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

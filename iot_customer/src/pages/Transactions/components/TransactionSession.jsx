import React, { useEffect, useState } from "react";
import { getRequest } from "../../../api";
import { fetchData } from "../../../api/fetchData";
import { Car, DollarSign } from "lucide-react";
import {
  calculateDuration,
  formatDate,
  formatDuration,
} from "../../../utils/formatters";
import StatusChip from "../../Activity/components/StatusChip";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
export default function TransactionSession({
  isOpen,
  sessionId,
  onClose,
  transaction,
}) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!sessionId || !isOpen) return;
    // const fetchSession = async () => {
    //   setLoading(true);
    //   setFetchError(null);
    //   try {
    //     const response = await getRequest(`/api/session/${sessionId}`, session_id= sessionId);
    //     if (response.code === 200) {
    //       setSession(response.info);
    //     } else {
    //       throw new Error(response.message || "Failed to fetch session.");
    //     }
    //   } catch (err) {
    //     setFetchError(err.message || "Failed to fetch session.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    void fetchData(
      "/session/transaction-session",
      setSession,
      setLoading,
      setFetchError,
      null,
      { sessionId }
    );
  }, [sessionId, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Parking Session Details</h2>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading && <p>Loading...</p>}
        {fetchError && <p className="text-red-600">Error: {fetchError}</p>}

        {session && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Session ID
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.session_id}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Vehicle Plate
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.Vehicle.vehicle_plate}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Entry Time
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.entry_time ? formatDate(session.entry_time) : "—"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Exit Time
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.exit_time ? formatDate(session.exit_time) : "—"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Duration
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {formatDuration(calculateDuration(session))}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Status
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={session.status} type="status" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Payment Status
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip
                      status={session.payment_status}
                      type="payment"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Transaction ID
                  </td>
                  <td className="px-4 py-3">
                    {transaction ? transaction.transaction_id : "—"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Payment method
                  </td>
                  <td className="px-4 py-3">
                    {transaction ? transaction.payment_method : "—"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300">
                    Fee
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.fee ? (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        {Number.parseFloat(session.fee).toFixed(2)}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
      {/* 
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={onClose}
      >
        Close
      </button> */}
    </Dialog>
  );
}

import React, { useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { DollarSign, FileText } from "lucide-react";
import StatusChip from "./StatusChip.jsx";
import {
  calculateDuration,
  formatDate,
  formatDuration,
} from "../../../utils/formatters.js";
import { Link } from "react-router-dom";
import { getVehicleIcon } from "../../../utils/helpers.jsx";
import { useVehicleTypeStore } from "../../../store/useVehicleTypeStore.js";
import TransactionDetailsmodal from "./TransactionDetailsModal.jsx";

const ParkingSessionTableItem = ({ session }) => {
  const duration = calculateDuration(session);
  const getTypeNameById = useVehicleTypeStore((state) => state.getTypeNameById);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);

  const handleOpenTransaction = () => {
    setOpenTransactionDialog(true);
  };

  const handleCloseTransaction = () => {
    setOpenTransactionDialog(false);
  };
  return (
    <>
      <TableRow hover>
        <TableCell>#{session.session_id}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {session.Vehicle?.user_id ? (
              <Chip
                label={
                  <Link
                    to={`/user/${session.Vehicle.user_id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {session.Vehicle.user_id}
                  </Link>
                }
                color="primary"
                variant="filled"
                size="small"
              />
            ) : session.is_guest ? (
              <Chip
                label={`Guest`}
                color="secondary"
                variant="filled"
                size="small"
              />
            ) : (
              <Chip
                label={`Unknown User`}
                color="error"
                variant="filled"
                size="small"
              />
            )}
          </Box>
        </TableCell>
        <TableCell>
          {session.Vehicle ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-8">
                  {getVehicleIcon(
                    session.Vehicle.vehicle_type_id || session.vehicle_type_id
                  )}
                </span>
                <span className="font-medium text-lg">
                  {(session.Vehicle.vehicle_plate || session.vehicle_plate) ??
                    "Unknown Number"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                (
                {getTypeNameById(
                  session.Vehicle.vehicle_type_id || session.vehicle_type_id
                )}
                )
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-8">
                  {getVehicleIcon(session.vehicle_type_id)}
                </span>
                <span className="font-medium text-lg">
                  {session.vehicle_plate ?? "Unknown Number"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({getTypeNameById(session.vehicle_type_id)})
              </span>
            </div>
          )}
        </TableCell>

        <TableCell>{formatDate(session.entry_time)}</TableCell>
        <TableCell>
          {session.exit_time ? formatDate(session.exit_time) : "—"}
        </TableCell>
        <TableCell>{formatDuration(duration)}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StatusChip status={session.status} type="status" />
            {session.payment_status === "paid" && (
              <Tooltip title="View Transaction">
                <IconButton size="small" onClick={handleOpenTransaction}>
                  <FileText size={18} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell>
          <StatusChip status={session.payment_status} type="payment" />
        </TableCell>
        <TableCell>
          {session.fee > 0 ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DollarSign size={16} style={{ marginRight: 4 }} />
              {Number.parseFloat(session.fee).toFixed(2)}
            </Box>
          ) : (
            <span className="text-gray-400 italic">Not Available</span>
          )}
        </TableCell>
      </TableRow>
      <TransactionDetailsmodal
        isOpen={openTransactionDialog}
        onClose={handleCloseTransaction}
        sessionId={session.session_id}
      />
    </>
  );
};

export default ParkingSessionTableItem;

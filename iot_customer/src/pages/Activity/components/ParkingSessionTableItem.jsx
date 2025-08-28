import React, { useState } from "react";
import { TableRow, TableCell, Box, Button, Tooltip, IconButton } from "@mui/material";
import { Car, DollarSign, FileText } from "lucide-react";
import StatusChip from "./StatusChip";
import TransactionDetailsModal from "./TransactionDetailsModal";
import {
  formatDate,
  calculateDuration,
  formatDuration,
} from "../../../utils/formatters";

const ParkingSessionTableItem = ({ session }) => {
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);

  const handleOpenTransaction = () => {
    setOpenTransactionDialog(true);
  };

  const handleCloseTransaction = () => {
    setOpenTransactionDialog(false);
  };

  const duration = calculateDuration(session);

  return (
    <>
      <TableRow hover>
        <TableCell>#{session.session_id}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Car size={16} style={{ marginRight: 8 }} />
            {session.Vehicle.vehicle_plate}
          </Box>
        </TableCell>
        <TableCell>
          {session.entry_time ? formatDate(session.entry_time) : "—"}
        </TableCell>
        <TableCell>
          {session.exit_time ? formatDate(session.exit_time) : "—"}
        </TableCell>
        <TableCell>{formatDuration(duration)}</TableCell>
        <TableCell>
          <StatusChip status={session.status} type="status" />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StatusChip status={session.payment_status} type="payment" />
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
          {session.fee ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DollarSign size={16} style={{ marginRight: 4 }} />
              {Number.parseFloat(session.fee).toFixed(2)}
            </Box>
          ) : (
            "—"
          )}
        </TableCell>
      </TableRow>

      <TransactionDetailsModal
        isOpen={openTransactionDialog}
        onClose={handleCloseTransaction}
        sessionId={session.session_id}
      />
    </>
  );
};

export default ParkingSessionTableItem;

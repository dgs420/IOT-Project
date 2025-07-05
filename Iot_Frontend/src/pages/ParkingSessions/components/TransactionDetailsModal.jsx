import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { DollarSign } from "lucide-react";
import StatusChip from "./StatusChip";
import {
  formatDate,
} from "../../../utils/formatters";
import { fetchData } from "@/api/fetchData";

const TransactionDetailsmodal = ({ isOpen, onClose, sessionId }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!sessionId || !isOpen) return;
    setLoading(true);
    setFetchError(null);
    void fetchData(
      "/payment/session-transaction",
      setTransaction,
      setLoading,
      setFetchError,
      null,
      { session_id: sessionId }
    );
  }, [sessionId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Transaction Details</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {fetchError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {fetchError}
          </Typography>
        )}

        {transaction && (
          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "collapse" }}
          >
            <tbody>
              <TableRow
                label="Transaction ID"
                value={transaction.transaction_id}
              />
              <TableRow
                label="Payment Method"
                value={
                  <StatusChip
                    status={transaction.payment_method}
                    type="payment_method"
                  />
                }
                // transaction.payment_method || "—"}
              />
              <TableRow
                label="Amount"
                value={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DollarSign size={16} />
                    {Number.parseFloat(transaction.amount).toFixed(2)}
                  </Box>
                }
              />
              <TableRow
                label="Transaction Type"
                value={transaction.transaction_type}
              />
              {/* <TableRow
                label="Status"
                value={
                  <StatusChip status={transaction.status} type="payment" />
                }
              /> */}
              <TableRow
                label="Created At"
                value={formatDate(transaction.createdAt)}
              />
              {/* <TableRow label="Balance" value={transaction.balance} /> */}
            </tbody>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsmodal;

const TableRow = ({ label, value }) => (
  <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
    <td
      style={{
        padding: "8px 12px",
        fontWeight: 600,
        background: "#f9fafb",
        color: "#374151",
        width: "40%",
      }}
    >
      {label}
    </td>
    <td style={{ padding: "8px 12px", color: "#1f2937" }}>{value}</td>
  </tr>
);

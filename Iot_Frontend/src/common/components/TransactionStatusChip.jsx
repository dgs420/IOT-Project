import React from "react";
import { Chip } from "@mui/material";

const statusColorMap = {
  status: {
    completed: "success",
    failed: "error",
    pending: "warning",
  },
  method: {
    cash: "default",
    rfid_balance: "primary",
    stripe: "secondary",
  },
  type: {
    'top-up': "success",
    fee: "info",
  },
};

export const TransactionStatusChip = ({ status, type }) => {
  const color = statusColorMap[type]?.[status] || "default";

  return <Chip label={status} size="small" color={color} variant="outlined" />;
};

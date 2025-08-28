import React from "react";
import { Chip } from "@mui/material";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Banknote, 
  DollarSign, 
  CreditCard 
} from "lucide-react";

const StatusChip = ({ status, type = "status" }) => {
  const getIconComponent = (iconName, size = 16) => {
    switch (iconName) {
      case "check-circle":
        return <CheckCircle2 size={size} />;
      case "x-circle":
        return <XCircle size={size} />;
      case "clock":
        return <Clock size={size} />;
      case "alert-circle":
        return <AlertCircle size={size} />;
      case "contactless-payment":
        return <Banknote size={size} />;
      case "dollar-sign":
        return <DollarSign size={size} />;
      case "credit-card":
        return <CreditCard size={size} />;
      default:
        return <AlertCircle size={size} />;
    }
  };

  const getChipProps = () => {
    if (type === "payment") {
      switch (status) {
        case "paid":
          return { color: "success", icon: "check-circle" };
        case "unpaid":
          return { color: "error", icon: "x-circle" };
        case "pending":
          return { color: "warning", icon: "clock" };
        default:
          return { color: "default", icon: "alert-circle" };
      }
    } else if (type === "payment_method") {
      switch (status) {
        case "rfid_balance":
          return { color: "primary", icon: "contactless-payment" };
        case "cash":
          return { color: "success", icon: "dollar-sign" };
        case "stripe":
          return { color: "warning", icon: "credit-card" };
        default:
          return { color: "default", icon: "alert-circle" };
      }
    } else {
      switch (status) {
        case "active":
          return { color: "primary", icon: "clock" };
        case "completed":
          return { color: "success", icon: "check-circle" };
        default:
          return { color: "default", icon: "alert-circle" };
      }
    }
  };

  const { color, icon } = getChipProps();
  const iconComponent = getIconComponent(icon);

  return (
    <Chip
      icon={iconComponent}
      label={status}
      size="small"
       /* @ts-ignore */
      color={color}
      sx={{ textTransform: "capitalize" }}
    />
  );
};

export default StatusChip;

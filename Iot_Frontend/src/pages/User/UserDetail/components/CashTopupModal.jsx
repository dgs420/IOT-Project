import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { CustomButton } from "@/common/components/CustomButton";
import { putRequest } from "@/api";
import { toast } from "react-toastify";

const CashTopUpModal = ({ userId, open, onClose, setUserDetails }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      setError("Only up to 2 decimal places allowed.");
      return;
    }

    try {
      const response = await putRequest("/payment/top-up-cash", {
        user_id: userId, // replace with your actual user id
        amount: value,
      });

      if (response.code === 200) {
        toast.success(response.message);
        setUserDetails((prev) => ({
          ...prev,
          balance: ((parseFloat(prev.balance) || 0) + value).toFixed(2),
        }));  
        onClose();
        setAmount("");
        setError("");
      } else {
        setError(response.message || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      setError(
        error?.message || "Failed to top up balance. Please try again later."
      );
    }
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Top-up by Cash</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Make sure the correct amount is entered. Only positive numbers with up
          to 2 decimal places are allowed.
        </Typography>
        <TextField
          autoFocus
          label="Amount"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={!!error}
          helperText={error}
          type="number"
          inputProps={{
            min: "0",
            step: "0.01",
          }}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton title="Cancel" color="danger" onClick={handleClose} />
        <CustomButton title="Confirm" color="success" onClick={handleSubmit} />
        {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
          Confirm
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default CashTopUpModal;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { CustomButton } from "@/common/components/CustomButton";
import { useSerialRFID } from "@/hooks/useSerialRFID";
import { putRequest } from "@/api";
import { toast } from "react-toastify";

const AssignCardModal = ({ open, onClose, vehicleId }) => {
  const [cardNumber, setCardNumber] = useState("");
  const { readCard, cancelRead } = useSerialRFID();

  const handleApprove = async () => {
    if (!cardNumber) return;
    const response = await putRequest(`/vehicle/assign-card`, {
      vehicle_id: vehicleId,
      card_number: cardNumber,
    });
    if (response.code === 200) {
      setCardNumber("");
      toast.success(response.message);
      onClose();
    } else {
      toast.error(response.message);
    }
  };

  const handleReadCard = () => {
    readCard((cardId) => {
      setCardNumber(cardId);
    });
  };

  const handleClose = () => {
    setCardNumber("");
    cancelRead();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Assign New Card</DialogTitle>
      <DialogContent dividers>
        <p className="text-sm text-gray-600 mb-2">
          Please scan or enter the new card number to assign it to this vehicle.
        </p>
        <TextField
          autoFocus
          label="Card Number"
          fullWidth
          variant="outlined"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton title="Cancel" color="secondary" onClick={handleClose} />
        <CustomButton
          title="Read Card"
          color="primary"
          onClick={handleReadCard}
        />
        <CustomButton title="Approve" color="success" onClick={handleApprove} />
      </DialogActions>
    </Dialog>
  );
};

export default AssignCardModal;

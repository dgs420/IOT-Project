import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { putRequest } from "../../../../api";
import { CustomButton } from "@/common/components/CustomButton";

const AdminResetPasswordModal = ({ open, onClose, userId }) => {
  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await putRequest(`/user/admin-reset-password`, {
        user_id: userId,
        password: passwordForm.new_password,
      });

      if (response.code !== 200) {
        toast.error(response.message || "Failed to reset password.");
      } else {
        toast.success("Password reset successfully.");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while resetting the password.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handlePasswordSubmit}>
        <DialogTitle>Reset User Password</DialogTitle>

        <DialogContent dividers>
          <TextField
            required
            fullWidth
            margin="normal"
            label="New Password"
            type="password"
            name="new_password"
            value={passwordForm.new_password}
            onChange={handlePasswordChange}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Confirm New Password"
            type="password"
            name="confirm_password"
            value={passwordForm.confirm_password}
            onChange={handlePasswordChange}
          />
        </DialogContent>

        <DialogActions>
          <CustomButton
            type="button"
            color="danger"
            onClick={onClose}
            title="Cancel"
          />
          <CustomButton
            type="submit"
            color="primary"
            title="Reset Password"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminResetPasswordModal;

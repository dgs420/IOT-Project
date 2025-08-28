// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomButton } from "../../../Common/Components/CustomButton.jsx";
import { postRequest } from "../../../api";
import { LockReset } from "@mui/icons-material";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }

    try {
      const res = await postRequest("/auth/reset-forgot-password", {
        token,
        newPassword,
      });
      if (res.code !== 200) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        navigate("/login");
      }
      //   setMessage(res.message || 'Password has been reset');
      //   setError('');
    } catch (err) {
      setError("Failed to reset password");
      setMessage("");
    }

    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Paper
        sx={{ p: 4, borderRadius: 3, maxWidth: 500, width: "100%" }}
        elevation={24}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              mx: "auto",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockReset sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Typography variant="h5" component="h1">
            Reset Password
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <CustomButton type="submit" className="w-full mt-4 justify-center">
            Reset Password
          </CustomButton>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity={error ? "error" : "success"}>
            {error || message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ResetPassword;

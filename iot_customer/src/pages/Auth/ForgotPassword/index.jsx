// @ts-nocheck
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { CustomButton } from "../../../Common/Components/CustomButton.jsx";
import { postRequest } from "../../../api";
import { Email } from "@mui/icons-material";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postRequest("/auth/forgot-password", { email });
      if (res.code !== 200) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
      setMessage(
        res.message || "If this email exists, a reset link has been sent."
      );
    } catch (err) {
      setMessage("Failed to send reset link");
    }
    // setSnackbarOpen(true);
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
            <Email sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Typography variant="h5" component="h1">
            Forgot Password
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomButton type="submit" className="w-full mt-4 justify-center">
            Send Reset Link
          </CustomButton>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="info">{message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;

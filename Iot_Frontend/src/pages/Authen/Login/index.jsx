import React, { useState } from "react";
import { toast } from "react-toastify";
import { postRequest } from "../../../api/index.js";
import { CustomButton } from "../../../common/components/CustomButton.jsx";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../store/useUserStore.js";
import { Person } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore.getState();

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await postRequest("/auth/login-admin", {
        email,
        password,
      });

      if (response.code !== 200) {
        toast.error(response.message);
        throw new Error("Login failed");
      }

      const { token, user_id, role, username } = response.info;

      setUser({
        token: token,
        uid: user_id,
        username: username,
        role: role,
      });
      //   sessionStorage.setItem("token", token);
      //   sessionStorage.setItem("uid", uid);
      //   sessionStorage.setItem("role", role);
      //   sessionStorage.setItem("username", username);

      //   // Redirect user
      //   window.location.href = "/";
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Person sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 3, color: "#2d3748", mb: 1 }}
          >
            Entry Management System
          </Typography>
          <p className="text-slate-400 text-sm">Login to continue</p>
        </Box>
        <form onSubmit={handleLogin} className="flex flex-col">
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <CustomButton
            type="submit"
            onClick={handleLogin}
            title={isLoading ? "Signing in..." : "Sign In"}
            className="w-full items-center justify-center mt-4"
            disabled={isLoading}
          />
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-slate-500">
              Authorized personnel only
            </p>
          </div>
        </form>
        {/* <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity="error">
              {error}
            </Alert>
          </Snackbar> */}
      </Paper>
    </Box>
  );
};

export default Login;

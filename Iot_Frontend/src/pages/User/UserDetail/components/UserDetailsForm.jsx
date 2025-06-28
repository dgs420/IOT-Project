// Components/UserDetailsForm.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Grid2,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Person,
  Email,
  Badge,
  SupervisorAccount,
  Save,
  EditOutlined,
} from "@mui/icons-material";
import { putRequest } from "../../../../api/index.js";
import { toast } from "react-toastify";
import { CustomButton } from "../../../../common/components/CustomButton.jsx";
import { formatCurrency } from "@/utils/formatters.js";
import { set } from "date-fns";
import AdminResetPasswordModal from "./ResetPasswordModal.jsx";

// eslint-disable-next-line react/prop-types
const UserDetailsForm = ({ userDetails, setUserDetails, userId, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await putRequest(
        `/user/user-update/${userId}`,
        userDetails
      );
      if (response.code === 200) {
        toast.success("User details updated successfully.");
        setEditMode(false);
        if (onUpdate) onUpdate();
      } else {
        setError(response.message || "Failed to update user details");
        toast.error(response.message);
        console.error("Error updating user:", response);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      setError("Failed to update user details. Please try again.");
      toast.error("Failed to update user details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: "visible",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h5">User Details</Typography>
          </Box>
        }
        action={
          !editMode && (
            <IconButton
              color="primary"
              onClick={() => setEditMode(true)}
              sx={{
                bgcolor: "primary.light",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.main" },
              }}
            >
              <EditOutlined />
            </IconButton>
          )
        }
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
          {error}
        </Alert>
      )}

      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleUserUpdate}>
          <Grid2 container spacing={3}>
            <Grid2>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={userDetails.username || ""}
                onChange={handleUserInputChange}
                disabled={!editMode}
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userDetails.email || ""}
                onChange={handleUserInputChange}
                disabled={!editMode}
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={userDetails.first_name || ""}
                onChange={handleUserInputChange}
                disabled={!editMode}
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={userDetails.last_name || ""}
                onChange={handleUserInputChange}
                disabled={!editMode}
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2>
              <FormControl
                fullWidth
                variant={editMode ? "outlined" : "filled"}
                disabled={!editMode}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={userDetails.role || "user"}
                  onChange={handleUserInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SupervisorAccount color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2>
              <div className="flex items-center gap-2 p-3 rounded-md border border-gray-300">
                <Typography variant="subtitle2" color="text.secondary">
                  Current Balance:
                </Typography>
                <Typography variant="h6" color="text.primary" fontWeight={600}>
                  {formatCurrency(userDetails.balance || 0)}
                </Typography>
              </div>
            </Grid2>
          </Grid2>

          {editMode && (
            <>
              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <CustomButton
                  type="button"
                  color="warning"
                  onClick={() => setOpenPasswordModal(true)}
                  disabled={isSubmitting}
                  title="Reset Password"
                />
                <CustomButton
                  type="button"
                  color="danger"
                  onClick={() => setEditMode(false)}
                  disabled={isSubmitting}
                  title="Cancel"
                />

                <CustomButton
                  type="submit"
                  color="success"
                  disabled={isSubmitting}
                  title={isSubmitting ? "Saving..." : "Save Changes"}
                  icon={
                    isSubmitting ? <CircularProgress size={20} /> : <Save />
                  }
                />

                {/* <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                                    sx={{ px: 3 }}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button> */}
              </Box>
            </>
          )}
        </form>
      </CardContent>
      {openPasswordModal && (
        <AdminResetPasswordModal
          userId={userId}
          setShowPasswordModal={setOpenPasswordModal}
        />
      )}
    </Card>
  );
};

export default UserDetailsForm;

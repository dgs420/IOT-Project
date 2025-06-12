import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from "@mui/material";
import { Check, Loader } from "lucide-react";
import { useVehicleTypeStore } from "../../../store/useVehicleTypeStore.js";
import { CustomButton } from "../../../common/components/CustomButton.jsx";

const ParkingSpaceForm = ({ open, onClose, onSave, initialData, mode }) => {
  const [formData, setFormData] = useState({
    space_id: null,
    vehicle_type_id: "",
    total_spaces: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);

  // Set initial data when dialog opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        space_id: initialData.space_id || null,
        vehicle_type_id: initialData.vehicle_type_id || "",
        total_spaces: initialData.total_spaces || "",
      });
    } else {
      setFormData({
        space_id: null,
        vehicle_type_id: "",
        total_spaces: "",
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total_spaces" ? Number.parseInt(value) || "" : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "create" && !formData.vehicle_type_id) {
      newErrors.vehicle_type_id = "Vehicle type is required";
    }

    if (!formData.total_spaces) {
      newErrors.total_spaces = "Total spaces is required";
    } else if (formData.total_spaces <= 0) {
      newErrors.total_spaces = "Total spaces must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving parking space:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {mode === "create" ? "Add New Parking Space" : "Edit Parking Space"}
      </DialogTitle>

      <DialogContent dividers>
        {mode === "create" && (
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.vehicle_type_id}
          >
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              name="vehicle_type_id"
              value={formData.vehicle_type_id}
              onChange={handleChange}
              disabled={loading}
            >
              {vehicleTypes.length === 0 ? (
                <MenuItem disabled>No vehicle types available</MenuItem>
              ) : (
                vehicleTypes.map((type) => (
                  <MenuItem
                    key={type.vehicle_type_id}
                    value={type.vehicle_type_id}
                  >
                    {type.vehicle_type_name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.vehicle_type_id && (
              <FormHelperText>{errors.vehicle_type_id}</FormHelperText>
            )}
          </FormControl>
        )}

        <TextField
          fullWidth
          label="Total Spaces"
          name="total_spaces"
          type="number"
          value={formData.total_spaces}
          onChange={handleChange}
          error={!!errors.total_spaces}
          helperText={errors.total_spaces}
          disabled={loading}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />

        {mode === "edit" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Note: Reducing total spaces below the current occupied count may
            cause issues.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <CustomButton
          color="danger"
          onClick={onClose}
          disabled={loading}
          title={"Cancel"}
        />
        <CustomButton
          color="primary"
          icon={
            loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <Check size={18} />
            )
          }
          title={loading ? "Saving..." : "Save"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ParkingSpaceForm;

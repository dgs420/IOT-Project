"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  TextField,
  InputAdornment,
  Grid,
  Grid2,
} from "@mui/material";
import { Plus, Search, RefreshCw } from "lucide-react";
import {
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
} from "../../api/parkingSpaceApi";
import ParkingSpaceStats from "./components/ParkingSpaceStats";
import ParkingSpaceList from "./components/ParkingSpaceList";
import ParkingSpaceForm from "./components/ParkingSpaceForm";
import { useVehicleTypeStore } from "../../store/useVehicleTypeStore.js";
import { fetchData } from "../../api/fetchData.js";
import { toast } from "react-toastify";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";
import { deleteRequest } from "../../api/index.js";

const ParkingSpaceManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create",
    data: null,
  });

  useEffect(() => {
    void fetchData("/parking-spaces", setSpaces);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSpaces(spaces);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = spaces.filter((space) => {
        const vehicleType = vehicleTypes.find(
          (type) => type.vehicle_type_id === space.vehicle_type_id
        );
        const vehicleTypeName = vehicleType
          ? vehicleType.vehicle_type_name.toLowerCase()
          : "";

        return (
          space.space_id.toString().includes(query) ||
          vehicleTypeName.includes(query)
        );
      });
      setFilteredSpaces(filtered);
    }
  }, [searchQuery, spaces, vehicleTypes]);

  const handleAddClick = () => {
    setFormDialog({
      open: true,
      mode: "create",
      data: null,
    });
  };

  const handleEditClick = (space) => {
    setFormDialog({
      open: true,
      mode: "edit",
      data: space,
    });
  };

  const handleSave = async (formData) => {
    if (formDialog.mode === "create") {
      await createParkingSpace(formData);
    } else {
      await updateParkingSpace(formData);
    }
  };

  const handleDelete = async (spaceId) => {
    try {
      const response = await deleteRequest('/parking-spaces/delete',{space_id: spaceId});
      if (response.code === 200) {
        setSpaces((prev) => prev.filter((space) => space.space_id !== spaceId));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error("Error deleting parking space:", err);
      toast.error(err.message || "Failed to delete parking space");
    }
  };

  return (
    <Box>
      <PageContentHeader
        label="Parking Space Management"
        description="Manage parking spaces for different vehicle types"
        buttonLabel = "Add Parking Space"
        onClick={handleAddClick}
      />
      <ParkingSpaceStats spaces={spaces} />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search parking spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid2>

          <Grid2
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
              onClick={() => fetchData("/parking-spaces", setSpaces)}
              disabled={loading}
            >
              Refresh
            </Button>

          </Grid2>
        </Grid2>
      </Paper>

      <ParkingSpaceList
        spaces={filteredSpaces}
        vehicleTypes={vehicleTypes}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <ParkingSpaceForm
        open={formDialog.open}
        onClose={() => setFormDialog((prev) => ({ ...prev, open: false }))}
        onSave={handleSave}
        initialData={formDialog.data}
        mode={formDialog.mode}
      />
    </Box>
  );
};

export default ParkingSpaceManagement;

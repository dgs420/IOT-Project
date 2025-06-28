import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { useVehicleTypeStore } from "../../../store/useVehicleTypeStore";

export default function HomeVehiclesItem({ vehicle }) {
  const chipStyles = {
    parking: { borderColor: "green", color: "green" },
    exited: { borderColor: "red", color: "red" },
    default: { borderColor: "gray", color: "gray" },
  };

  const { borderColor, color } =
    chipStyles[vehicle.status] || chipStyles.default;
  const getTypeNameById = useVehicleTypeStore((state) => state.getTypeNameById);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        "&:hover": { boxShadow: 2 },
      }}
    >
      <Box className="text-md text-gray-700">
        <div>
          <span className="text-gray-500">License Plate:</span>{" "}
          <span className="font-medium">{vehicle.vehicle_plate}</span>
          <span className="ml-1 text-sm text-gray-500 capitalize">
            ({getTypeNameById(vehicle.vehicle_type_id)})
          </span>
        </div>
      </Box>

      <Chip
        label={vehicle.status}
        variant="outlined"
        size="small"
        sx={{
          textTransform: "capitalize",
          borderColor,
          color,
        }}
      />
    </Box>
  );
}

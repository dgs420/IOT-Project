import React from "react";
import {
  TwoWheeler,
  DirectionsCar,
  AirportShuttle,
  ElectricCar,
  LocalShipping,
  DirectionsBus,
  HelpOutline,
} from "@mui/icons-material";

const vehicleIconMap = {
  1: TwoWheeler,
  2: DirectionsCar,
  3: AirportShuttle,
  4: LocalShipping,
  5: ElectricCar,
  6: DirectionsBus,
  // 7: ??? bruh
};

export const getVehicleIcon = (vehicle_type_id, props = {}) => {
  const IconComponent = vehicleIconMap[vehicle_type_id] || HelpOutline; // fallback
  return <IconComponent {...props} />;
};

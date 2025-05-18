import React from "react";
import {
    TwoWheeler,
    DirectionsCar,
    AirportShuttle,
    ElectricCar,
    LocalShipping,
    DirectionsBus,
    HelpOutline,
} from '@mui/icons-material';


const vehicleIconMap = {
    1: TwoWheeler,         // Motorcycle
    2: DirectionsCar,      // Sedan
    3: AirportShuttle,     // SUV (closest match)
    4: LocalShipping,      // Truck
    5: ElectricCar,        // Electric Car
    6: DirectionsBus,      // Bus
    // 7: ??? bruh (maybe fallback)
};

export const getVehicleIcon = (vehicle_type_id, props = {}) => {
    const IconComponent = vehicleIconMap[vehicle_type_id] || HelpOutline; // fallback
    return <IconComponent {...props} />;
};

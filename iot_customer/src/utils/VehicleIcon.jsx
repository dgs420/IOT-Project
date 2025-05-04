import React from 'react';
import { Car, Truck, Link2Icon  } from 'lucide-react';
import {
    TwoWheeler,
    DirectionsCar,
    AirportShuttle,
    ElectricCar,
    LocalShipping,
    DirectionsBus,
    HelpOutline,
} from '@mui/icons-material';

// export const VehicleIcon = (type ) => {
//     switch (type) {
//         case 2:
//             return <Car className="h-5 w-5" />;
//         case 4:
//             return <Truck className="h-5 w-5" />;
//         case 1:
//             return <TwoWheeler className="h-5 w-5" />;
//         default:
//             return <Car className="h-5 w-5" />;
//     }
// };


const vehicleIconMap = {
    1: TwoWheeler,         // Motorcycle
    2: DirectionsCar,      // Sedan
    3: AirportShuttle,     // SUV (closest match)
    4: LocalShipping,      // Truck
    5: ElectricCar,        // Electric Car
    6: DirectionsBus,      // Bus
    // 7: ??? bruh (maybe fallback)
};

export const VehicleIcon = (vehicle_type_id, props = {}) => {
    const IconComponent = vehicleIconMap[vehicle_type_id] || DirectionsCar; // fallback
    return <IconComponent {...props} />;
};

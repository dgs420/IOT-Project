import {Car, Link2Icon as TwoWheeler, Truck} from "lucide-react";
import React from "react";


const getVehicleIcon = (type, className = "h-5 w-5 text-blue-600") => {
    switch (type?.toLowerCase()) {
        case 'car':
            return <Car className={className} />;
        case 'truck':
            return <Truck className={className} />;
        case 'motorcycle':
            return <TwoWheeler className={className} />;
        default:
            return <Car className={className} />;
    }
};

export default getVehicleIcon;
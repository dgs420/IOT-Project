import React from 'react';
import { Car, Truck, Link2Icon as TwoWheeler } from 'lucide-react';

export const VehicleIcon = ({ type }) => {
    switch (type) {
        case 2:
            return <Car className="h-5 w-5" />;
        case 4:
            return <Truck className="h-5 w-5" />;
        case 1:
            return <TwoWheeler className="h-5 w-5" />;
        default:
            return <Car className="h-5 w-5" />;
    }
};
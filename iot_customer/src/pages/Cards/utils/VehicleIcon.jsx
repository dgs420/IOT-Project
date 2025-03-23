import React from 'react';
import { Car, Truck, Link2Icon as TwoWheeler } from 'lucide-react';

export const VehicleIcon = ({ type }) => {
    switch (type.toLowerCase()) {
        case 'car':
            return <Car className="h-5 w-5" />;
        case 'truck':
            return <Truck className="h-5 w-5" />;
        case 'motorcycle':
            return <TwoWheeler className="h-5 w-5" />;
        default:
            return <Car className="h-5 w-5" />;
    }
};
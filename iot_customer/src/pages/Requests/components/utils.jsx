// Helper function to get vehicle icon
import { Car, Truck,  Link2Icon as TwoWheeler } from 'lucide-react';

export const getVehicleIcon = (type, className = "h-5 w-5 text-blue-600") => {
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
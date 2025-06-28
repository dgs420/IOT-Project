import React from 'react';
import { CreditCard, Plus } from 'lucide-react';

export const EmptyVehicleList = ({ searchActive }) => {
    return (
        <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
            <p className="mt-1 text-sm text-gray-500">
                {searchActive
                    ? "Try changing your search or filter settings."
                    : "Get started by requesting a new vehicle."}
            </p>
         
        </div>
    );
};
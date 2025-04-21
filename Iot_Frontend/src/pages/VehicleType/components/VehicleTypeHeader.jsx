import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Plus } from 'lucide-react';

const VehicleTypeHeader = ({ onAddNew }) => {
    return (
    <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900"> Vehicle Types Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your registered vehicle cards for parking access
                </p>
            </div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Plus size={18}/>}
                onClick={onAddNew}
            >
                Add New Vehicle Type
            </Button>

        </div>
    </div>
)
    ;
};

export default VehicleTypeHeader;
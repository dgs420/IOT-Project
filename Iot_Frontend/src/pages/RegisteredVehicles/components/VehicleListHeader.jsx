import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from 'antd';

export const VehicleListHeader = ({ onRequestCard }) => {
    return (
        <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-900">All Registered Vehicles</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all vehicles registered by users
                    </p>
                </div>
                <Button
                    onClick={onRequestCard}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Vehicle
                </Button>

            </div>
        </div>
    );
};
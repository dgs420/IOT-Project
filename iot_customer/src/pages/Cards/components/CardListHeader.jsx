import React from 'react';
import { Plus } from 'lucide-react';

export const CardListHeader = ({ onRequestCard }) => {
    return (
        <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-900">Your RFID Cards</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your registered vehicle cards for parking access
                    </p>
                </div>

                <button
                    onClick={onRequestCard}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Request New Card
                </button>
            </div>
        </div>
    );
};
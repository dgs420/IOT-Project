import React from "react";

const RequestHeader = () => {
    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Card Requests</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and track all user requests for RFID cards
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Export Requests
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestHeader;
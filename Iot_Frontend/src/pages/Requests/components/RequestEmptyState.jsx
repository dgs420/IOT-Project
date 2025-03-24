import React from 'react';
import {Clock} from 'lucide-react';

const RequestEmptyState = ({searchQuery, statusFilter}) => {
    return (
        <div className="bg-white rounded-lg shadow py-12 px-4 sm:px-6 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all'
                    ? "Try changing your search or filter settings."
                    : "There are no card requests at this time."}
            </p>
        </div>
    );
};

export default RequestEmptyState;
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
    switch (status.toLowerCase()) {
        case 'active':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </span>
            );
        case 'inactive':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
            );
        case 'entered':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Entered
        </span>
            );
        case 'exited':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <XCircle className="h-3 w-3 mr-1" />
          Exited
        </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle className="h-3 w-3 mr-1" />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
            );
    }
};
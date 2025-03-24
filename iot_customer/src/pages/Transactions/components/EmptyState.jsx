import React from 'react';
import { Wallet } from 'lucide-react';

const EmptyState = () => {
    return (
        <div className="py-12 text-center">
            <Wallet className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
                Try changing your filter settings or check back later.
            </p>
        </div>
    );
};

export default EmptyState;
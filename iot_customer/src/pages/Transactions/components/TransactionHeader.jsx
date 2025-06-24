// File: components/transactions/TransactionHeader.jsx
import React from 'react';
import { Filter, ChevronDown, Download } from 'lucide-react';

const TransactionHeader = ({ filterOpen, setFilterOpen }) => {
    return (
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>

                <div className="flex items-center space-x-2">
                    <button
                        className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <Filter className="h-4 w-4 mr-1.5 text-gray-500" />
                        Filter
                        <ChevronDown className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-1.5 text-gray-500" />
                        Export
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default TransactionHeader;
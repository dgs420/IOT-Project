// File: components/transactions/TransactionFilters.jsx
import React from 'react';

const TransactionFilter = ({ filters, setFilters }) => {
    const handleChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="mt-3 mx-6 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex flex-wrap gap-4">
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div> */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="top-up">Top-up</option>
                        <option value="fee">Fee</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <select
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.method}
                        onChange={(e) => handleChange('method', e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="rfid_balance">Balance</option>
                        <option value="cash">Cash</option>
                        <option value="stripe">Stripe</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="date"
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange('dateRange', {
                                ...filters.dateRange,
                                start: e.target.value
                            })}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange('dateRange', {
                                ...filters.dateRange,
                                end: e.target.value
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilter;
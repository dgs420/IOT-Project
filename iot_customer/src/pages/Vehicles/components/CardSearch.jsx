import React from 'react';
import {Filter, Search} from 'lucide-react';

export const CardSearch = ({
                               searchQuery,
                               onSearchChange,
                               statusFilter,
                               onStatusFilterChange
                           }) => {
    return (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by card number or vehicle number"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchQuery}
                        onChange={onSearchChange}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500"/>
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={statusFilter}
                        onChange={onStatusFilterChange}
                    >
                        <option value="all">All Statuses</option>
                        <option value="parking">Parking</option>
                        <option value="exited">Exited</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
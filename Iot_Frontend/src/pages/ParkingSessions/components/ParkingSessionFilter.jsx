import React from "react"
import {Paper,} from "@mui/material"
import {Filter, RefreshCw, Search} from "lucide-react"
import {CustomButton} from "../../../common/components/CustomButton.jsx";

const ParkingSessionFilters = ({
                                   searchQuery,
                                   setSearchQuery,
                                   statusFilter,
                                   setStatusFilter,
                                   paymentFilter,
                                   setPaymentFilter,
                                   onRefresh,
                                   loading,
                                   hasData,
                               }) => {
    return (
        <Paper sx={{p: 2, mb: 3}}>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by vehicle or session ID..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500"/>
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500"/>
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <CustomButton
                    icon={<RefreshCw size={18}/>}
                    onClick={onRefresh}
                    title="Refresh"
                    color="success"
                />
            </div>
        </Paper>

    )
}

export default ParkingSessionFilters

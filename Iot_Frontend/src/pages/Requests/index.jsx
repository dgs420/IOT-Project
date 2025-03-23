import React, {useEffect, useState} from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, Car, Truck, MoreVertical, User, Phone, MapPin, Calendar, ChevronDown, ChevronRight, Link2Icon as TwoWheeler } from 'lucide-react';
// import {getRequest} from "../../api/index.jsx";

// Main Page Component
export const UserRequests = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [sortBy, setSortBy] = useState('newest');
    const requestsData = [
        {
            "request_id": 1,
            "user_id": 17,
            "status": "pending",
            "vehicle_number": "",
            "vehicle_type": "car",
            "name": "",
            "contact_number": null,
            "delivery_address": ""
        },
        {
            "request_id": 2,
            "user_id": 17,
            "status": "pending",
            "vehicle_number": "adf-123213",
            "vehicle_type": "car",
            "name": "Trần Tùng Dương",
            "contact_number": "085625",
            "delivery_address": "số nhà 6, ngõ 208, đường Thái Bình, phường Trần Tế Xương"
        },
        // Adding more sample requests for demonstration
        {
            "request_id": 3,
            "user_id": 18,
            "status": "approved",
            "vehicle_number": "XYZ-789",
            "vehicle_type": "motorcycle",
            "name": "Jane Smith",
            "contact_number": "555-1234",
            "delivery_address": "123 Main Street, Apt 4B"
        },
        {
            "request_id": 4,
            "user_id": 19,
            "status": "rejected",
            "vehicle_number": "ABC-456",
            "vehicle_type": "truck",
            "name": "John Doe",
            "contact_number": "555-5678",
            "delivery_address": "456 Oak Avenue"
        }
    ];
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        const getUserRequests = async () => {
            try{
                // const response = await getRequest('/card/recent-cards');
                // console.log(response);
                // if (response.code === 200) {
                //     setRequests(response.info);
                // } else
                //     console.error(response.message);

                setRequests(requestsData);
            } catch ( error){
                console.error('Error fetching traffic logs:', error);
            }
        }

        getUserRequests();
    },[])
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <PageHeader />
            <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
            <RequestList
                requests={requests}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                sortBy={sortBy}
            />
        </div>
    );
};

// Page Header Component
const PageHeader = () => {
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

// Filter Bar Component
const FilterBar = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, sortBy, setSortBy }) => {
    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, vehicle number, or address"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Request List Component
const RequestList = ({ requests, searchQuery, statusFilter, sortBy }) => {
    // Filter and sort requests
    const filteredRequests = requests.filter(request => {
        // Filter by search query
        const matchesSearch =
            (request.name && request.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (request.vehicle_number && request.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (request.delivery_address && request.delivery_address.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filter by status
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

        return (searchQuery === '' || matchesSearch) && matchesStatus;
    });

    // Sort requests
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        if (sortBy === 'newest') {
            return b.request_id - a.request_id; // Assuming higher ID means newer
        } else {
            return a.request_id - b.request_id;
        }
    });

    if (sortedRequests.length === 0) {
        return <EmptyState searchQuery={searchQuery} statusFilter={statusFilter} />;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {sortedRequests.map(request => (
                    <RequestCard key={request.request_id} request={request} />
                ))}
            </ul>
        </div>
    );
};

// Request Card Component
const RequestCard = ({ request }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li className="bg-white hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                {getVehicleIcon(request.vehicle_type)}
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Request #{request.request_id}
                                </h3>
                                <StatusBadge status={request.status} />
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                                {request.name ? (
                                    <span>{request.name}</span>
                                ) : (
                                    <span className="italic text-gray-400">No name provided</span>
                                )}
                                {request.vehicle_number && (
                                    <span className="ml-2">• {request.vehicle_number}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                        >
                            {expanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                        <div className="relative">
                            <button className="p-1 rounded-full hover:bg-gray-200 focus:outline-none">
                                <MoreVertical className="h-5 w-5 text-gray-500" />
                            </button>
                            {/* Dropdown menu would go here */}
                        </div>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                            <RequestDetailItem
                                icon={<User className="h-4 w-4 text-gray-500" />}
                                label="Full Name"
                                value={request.name || "Not provided"}
                            />
                            <RequestDetailItem
                                icon={<Phone className="h-4 w-4 text-gray-500" />}
                                label="Contact Number"
                                value={request.contact_number || "Not provided"}
                            />
                            <RequestDetailItem
                                icon={getVehicleIcon(request.vehicle_type, "h-4 w-4 text-gray-500")}
                                label="Vehicle Information"
                                value={`${request.vehicle_number || "No number"} (${request.vehicle_type || "Unknown type"})`}
                            />
                            <RequestDetailItem
                                icon={<MapPin className="h-4 w-4 text-gray-500" />}
                                label="Delivery Address"
                                value={request.delivery_address || "Not provided"}
                            />
                        </dl>

                        <div className="mt-4 flex justify-end space-x-3">
                            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                View Details
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Approve
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

// Request Detail Item Component
const RequestDetailItem = ({ icon, label, value }) => {
    const isNotProvided = value === "Not provided" || value === "No number (Unknown type)";

    return (
        <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
                {icon}
                <span className="ml-2">{label}</span>
            </dt>
            <dd className={`mt-1 text-sm ${isNotProvided ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                {value}
            </dd>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;

    switch (status) {
        case 'approved':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = <CheckCircle className="h-3 w-3 mr-1" />;
            break;
        case 'rejected':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = <XCircle className="h-3 w-3 mr-1" />;
            break;
        case 'completed':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            icon = <CheckCircle className="h-3 w-3 mr-1" />;
            break;
        case 'pending':
        default:
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            icon = <Clock className="h-3 w-3 mr-1" />;
            break;
    }

    return (
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
    );
};

// Empty State Component
const EmptyState = ({ searchQuery, statusFilter }) => {
    return (
        <div className="bg-white rounded-lg shadow py-12 px-4 sm:px-6 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all'
                    ? "Try changing your search or filter settings."
                    : "There are no card requests at this time."}
            </p>
        </div>
    );
};

// Helper function to get vehicle icon
const getVehicleIcon = (type, className = "h-5 w-5 text-blue-600") => {
    switch (type?.toLowerCase()) {
        case 'car':
            return <Car className={className} />;
        case 'truck':
            return <Truck className={className} />;
        case 'motorcycle':
            return <TwoWheeler className={className} />;
        default:
            return <Car className={className} />;
    }
};
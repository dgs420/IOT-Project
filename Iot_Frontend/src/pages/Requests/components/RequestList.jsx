import React from "react";
import RequestCard from "./RequestCard.jsx";
import RequestEmptyState from "./RequestEmptyState.jsx";

const RequestList = ({ requests, searchQuery, statusFilter, sortBy, refreshRequest }) => {
    const filteredRequests = requests.filter(request => {
        const matchesSearch =
            (request.name && request.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (request.vehicle_number && request.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (request.delivery_address && request.delivery_address.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

        return (searchQuery === '' || matchesSearch) && matchesStatus;
    });

    const sortedRequests = [...filteredRequests].sort((a, b) => {
        if (sortBy === 'newest') {
            return b.request_id - a.request_id;
        } else {
            return a.request_id - b.request_id;
        }
    });

    if (sortedRequests.length === 0) {
        return <RequestEmptyState searchQuery={searchQuery} statusFilter={statusFilter} />;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {sortedRequests.map(request => (
                    <RequestCard key={request.request_id} request={request} refreshRequest={refreshRequest} />
                ))}
            </ul>
        </div>
    );
};

export default RequestList;
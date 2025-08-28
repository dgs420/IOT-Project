import React, { useState } from "react";
import RequestCard from "./RequestCard.jsx";
import RequestEmptyState from "./RequestEmptyState.jsx";
import { TablePagination } from "@mui/material";

const RequestList = ({
  requests,
  searchQuery,
  statusFilter,
  sortBy,
  refreshRequest,
}) => {
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      (request.name &&
        request.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.vehicle_plate &&
        request.vehicle_plate
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (request.delivery_address &&
        request.delivery_address
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return (searchQuery === "" || matchesSearch) && matchesStatus;
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "newest") {
      return b.request_id - a.request_id;
    } else {
      return a.request_id - b.request_id;
    }
  });

  if (sortedRequests.length === 0) {
    return (
      <RequestEmptyState
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {sortedRequests
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((request) => (
            <RequestCard
              key={request.request_id}
              request={request}
              refreshRequest={refreshRequest}
            />
          ))}
      </ul>
      <TablePagination
        component="div"
        count={sortedRequests.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[6, 12, 24]}
      />
    </div>
  );
};

export default RequestList;

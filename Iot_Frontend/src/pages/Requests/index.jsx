import React, { useEffect, useState } from "react";
import RequestFilterBar from "./components/RequestFilterBar.jsx";
import RequestList from "./components/RequestList.jsx";
import { fetchData } from "../../api/fetchData.js";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";
// import {getRequest} from "../../api/index.jsx";

// Main Page Component
export const UserRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [sortBy, setSortBy] = useState("newest");

  const [requests, setRequests] = useState([]);
  const onClick = () => {
    console.log("clicked");
  };

  useEffect(() => {
    void fetchData("/request/all-requests", setRequests, null, null);
  }, []);
  return (
    <div className="bg-white rounded-lg shadow">
      <PageContentHeader
        onClick={onClick}
        label="Vehicles Requests"
        description="Vehicles Requests"
        buttonLabel="Export request"
      />
      <RequestFilterBar
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
        refreshRequest={() =>
          fetchData("/request/all-requests", setRequests, null, null)
        }
      />
    </div>
  );
};

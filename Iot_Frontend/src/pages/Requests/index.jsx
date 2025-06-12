import React, { useEffect, useState } from "react";
import RequestFilterBar from "./components/RequestFilterBar.jsx";
import RequestList from "./components/RequestList.jsx";
import { fetchData } from "../../api/fetchData.js";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";
import {Box} from "@mui/material";
// import {getRequest} from "../../api/index.jsx";

// Main Page Component
export const UserRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [sortBy, setSortBy] = useState("newest");

  const [requests, setRequests] = useState([]);


  useEffect(() => {
    void fetchData("/request/all-requests", setRequests, null, null);
  }, []);
  return (
    <Box>
      <PageContentHeader
        label="Vehicles Requests"
        description="Vehicles Requests"
        className="mb-4"
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
    </Box>
  );
};

import React, {useEffect, useState} from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, Car, Truck, MoreVertical, User, Phone, MapPin, Calendar, ChevronDown, ChevronRight, Link2Icon as TwoWheeler } from 'lucide-react';
import {getRequest} from "../../api/index.js";
import RequestFilterBar from "./components/RequestFilterBar.jsx";
import RequestEmptyState from "./components/RequestEmptyState.jsx";
import RequestList from "./components/RequestList.jsx";

// Main Page Component
export const UserRequests = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const [requests, setRequests] = useState([]);
    useEffect(() => {
        const getUserRequests = async () => {
            try{
                const response = await getRequest('/request/your-requests');
                if (response.code === 200) {
                    setRequests(response.info);
                } else
                    console.error(response.message);

                // setRequests(requestsData);
            } catch ( error){
                console.error('Error fetching traffic logs:', error);
            }
        }

        getUserRequests();
    },[])
    return (
        <>
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
            />
        </>
    );
};





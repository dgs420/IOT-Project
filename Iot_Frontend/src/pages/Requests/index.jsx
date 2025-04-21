import React, {useEffect, useState} from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, Car, Truck, MoreVertical, User, Phone, MapPin, Calendar, ChevronDown, ChevronRight, Link2Icon as TwoWheeler } from 'lucide-react';
import RequestHeader from "./components/RequestHeader.jsx";
import RequestFilterBar from "./components/RequestFilterBar.jsx";
import RequestList from "./components/RequestList.jsx";
import {getRequest} from "../../api/index.js";
import {fetchData} from "../../api/fetchData.js";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";
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
    const  onClick  = () =>{
        console.log('clicked');
    }

    useEffect(() => {
        void fetchData('/request/all-requests', setRequests, null, null);
    },[])
    return (
        <div >
            <RequestHeader />
            <PageContentHeader
                onClick={onClick}
                label = "Card Requests"
                description = "Card Requests"
                buttonLabel = "Export request"
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
                refreshRequest={() => fetchData('/request/all-requests', setRequests, null, null)}
            />
        </div>
    );
};

import React, {useEffect, useState} from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, Car, Truck, MoreVertical, User, Phone, MapPin, Calendar, ChevronDown, ChevronRight, Link2Icon as TwoWheeler } from 'lucide-react';
import RequestHeader from "./components/RequestHeader.jsx";
import RequestFilterBar from "./components/RequestFilterBar.jsx";
import getVehicleIcon from "./utils/VehicleIcon.jsx";
import RequestList from "./components/RequestList.jsx";
import {getRequest} from "../../api/index.js";
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
                const response = await getRequest('/request/all-requests');
                console.log(response);
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
        <div className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-8">
            <RequestHeader />
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
        </div>
    );
};

// Page Header Component


// Filter Bar Component


// Request List Component


// Request Card Component
// eslint-disable-next-line react/prop-types


// Request Detail Item Component

// Status Badge Component




// Helper function to get vehicle icon

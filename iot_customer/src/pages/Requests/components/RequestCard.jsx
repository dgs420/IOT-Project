// Request Card Component
import {StatusBadge} from "./StatusBadge.jsx";
import RequestDetailItem from "./RequestDetailItem.jsx";
import {getVehicleIcon} from "./utils.jsx";
import {useState} from "react";
import {MoreVertical, User, Phone, MapPin, ChevronDown, ChevronRight, XCircle} from 'lucide-react';

export const RequestCard = ({ request }) => {
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
                    <>
                    </>

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
                                value={`${request.vehicle_number || "No number"} (${request.vehicle_type_id || "Unknown type"})`}
                            />
                            <RequestDetailItem
                                icon={<MapPin className="h-4 w-4 text-gray-500" />}
                                label="Delivery Address"
                                value={request.delivery_address || "Not provided"}
                            />

                            {request.status === 'rejected' && (
                                <RequestDetailItem
                                    icon={<XCircle className="h-4 w-4 text-gray-500" />}
                                    label="Rejection Reason"
                                    value={request.reason || "No reason provided"}
                                />
                            )}
                        </dl>


                    </div>
                )}
            </div>
        </li>
    );
};
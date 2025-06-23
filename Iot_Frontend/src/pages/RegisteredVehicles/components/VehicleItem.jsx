import React, {useState} from "react";
import {CreditCard, Eye, EyeOff, MoreHorizontal, Trash2} from "lucide-react";
import {StatusBadge} from "../utils/StatusBadge.jsx";
import {useVehicleTypeStore} from "../../../store/useVehicleTypeStore.js";
import {getVehicleIcon} from "../../../utils/helpers.jsx";
import {Link} from "react-router-dom";
import {deleteRequest} from "../../../api/index.js";
import {toast} from "react-toastify";
import {fetchData} from "../../../api/fetchData.js";
import {ConfirmModal} from "../../../common/components/ConfirmModal.jsx";

export const VehicleItem = ({vehicle,  onDeleteSucess}) => {
    const [showCardNumber, setShowCardNumber] = useState(false);
    const getTypeNameById = useVehicleTypeStore((state) => state.getTypeNameById);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    // TODO: Handle vehicle delete flow
    const confirmDelete = async () => {
        try {
            const response = await deleteRequest(`/vehicle/${vehicle.vehicle_id}`);
            if (response.code === 200) {
                toast.success("Vehicle deleted successfully.");
                onDeleteSucess();
                // await fetchData(`/vehicle/user-vehicles/${userId}`, setVehicles, null, null);
            } else {
                toast.error(response.message);
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            toast.error("Failed to delete card");
        } finally {
            setConfirmDeleteModal(false);
        }
    };
    return (
        <div
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`p-2 rounded-full ${
                                vehicle.status.toLowerCase() === "active"
                                    ? "bg-green-100"
                                    : vehicle.status.toLowerCase() === "parking"
                                        ? "bg-blue-100"
                                        : "bg-gray-100"
                            }`}
                        >
                            <CreditCard
                                className={`h-6 w-6 ${
                                    vehicle.status.toLowerCase() === "active"
                                        ? "text-green-600"
                                        : vehicle.status.toLowerCase() === "parking"
                                            ? "text-blue-600"
                                            : "text-gray-600"
                                }`}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {vehicle.card_number}
                            </h3>
                            <StatusBadge status={vehicle.status}/>
                        </div>
                    </div>

                    <div className="relative">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-5 w-5 text-gray-500"/>
                        </button>
                        {/* Dropdown menu would go here */}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm">
                        <div className="w-8">{getVehicleIcon(vehicle.vehicle_type_id)}</div>
                        <div>
                            <span className="text-gray-500">Vehicle:</span>{" "}
                            <span className="font-medium">{vehicle.vehicle_number}</span>
                            <span className="ml-1 text-xs text-gray-500 capitalize">
                                ({getTypeNameById(vehicle.vehicle_type_id)})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="flex items-center text-sm">
                            <div className="w-8">
                                <span
                                    className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                  ID
                </span>
                            </div>

                            <div>
                                <span className="text-gray-500">User ID:</span>{" "}
                                <Link
                                    className="font-mono font-medium hover:underline"
                                    to={`/user/${vehicle.user_id}`}
                                >
                                    <span className="font-mono font-medium">{vehicle.user_id}</span>
                                </Link>


                            </div>


                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="flex items-center text-sm">
                            <div className="w-8">
                                <CreditCard className="h-5 w-5 text-gray-500"/>
                            </div>

                            <div>
                                <span className="text-gray-500">Card Number:</span>{" "}
                                {showCardNumber ? (
                                    <span className="font-mono font-medium">
                                        {vehicle.rfid_card.card_number}
                                    </span>
                                ) : (
                                    <span className="font-mono font-medium">••••••••</span>
                                )}
                            </div>

                            <button
                                onClick={() => setShowCardNumber(!showCardNumber)}
                                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showCardNumber ? (
                                    <EyeOff className="h-4 w-4"/>
                                ) : (
                                    <Eye className="h-4 w-4"/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end space-x-2">
                    {/*<button*/}
                    {/*  onClick={() => onEdit(card)}*/}
                    {/*  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"*/}
                    {/*>*/}
                    {/*  <Edit className="h-3.5 w-3.5 mr-1" />*/}
                    {/*  Edit*/}
                    {/*</button>*/}

                    <button
                        onClick={() => setConfirmDeleteModal(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1"/>
                        Delete
                    </button>
                </div>
            </div>
            <ConfirmModal
                open={confirmDeleteModal}
                onClose={() => setConfirmDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this card?"
            />
        </div>
    );
};

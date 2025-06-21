import React, { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Phone, User } from "lucide-react";
import RequestDetailItem from "./RequestDetailItem.jsx";
import StatusBadge from "../utils/StatusBadge.jsx";
import ApproveModal from "./ApproveModal.jsx";
import RejectModal from "./RejectModal.jsx";
import { postRequest } from "../../../api/index.js";
import { toast } from "react-toastify";
import { getVehicleIcon } from "../../../utils/helpers.jsx";

const RequestCard = ({ request, refreshRequest }) => {
  const [expanded, setExpanded] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async (cardNumber) => {
    try {
      const response = await postRequest(
        `/request/${request.request_id}/approve`,
        { card_number: cardNumber }
      );
      if (response.code === 200) {
        toast.success(response.message);
        setShowApproveModal(false);
        // refreshRequest();
      } else {
        toast.error(response.message);
      }

      // }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("An error occurred while approving.");
    }
  };

  const handleReject = async (reason) => {
    try {
      const response = await postRequest(
        `/request/${request.request_id}/reject`,
        { reason }
      );
      if (response.code === 200) {
        toast.success(response.message);
        setShowRejectModal(false);
        refreshRequest();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("An error occurred while rejecting.");
    }
  };

  return (
    <li className="bg-white hover:bg-gray-50 transition-colors">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                {getVehicleIcon(request.vehicle_type_id)}
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
            {request.status === "pending" && (
              <div className="flex items-center space-x-3 mx-8">
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
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
                icon={getVehicleIcon(request.vehicle_type_id, { className: "h-4 w-4 text-gray-500" })}
                label="Vehicle Information"
                value={`${request.vehicle_number || "No number"} (${
                  request.vehicle_type_id || "Unknown type"
                })`}
              />
              <RequestDetailItem
                icon={<MapPin className="h-4 w-4 text-gray-500" />}
                label="Delivery Address"
                value={request.delivery_address || "Not provided"}
              />
            </dl>
          </div>
        )}
      </div>

      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApprove}
        request={request}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        request={request}
      />
    </li>
  );
};

export default RequestCard;

import React, { useState } from "react";

const RejectModal = ({ isOpen, onClose, onReject, request }) => {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold text-gray-900">Reject Request</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Are you sure you want to reject request <strong>#{request.request_id}</strong>?
                    Please provide a reason below.
                </p>
                <textarea
                    className="w-full mt-3 p-2 border rounded-md"
                    placeholder="Enter reason for rejection..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onReject(reason)}
                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                        disabled={!reason.trim()} // Prevent empty reason
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;

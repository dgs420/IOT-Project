import React, { useState } from "react";

const ApproveModal = ({ isOpen, onClose, onApprove, request }) => {
    const [cardNumber, setCardNumber] = useState("");

    if (!isOpen) return null;

    const handleApprove = () => {
        onApprove(cardNumber);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold">Approve Request</h2>
                <p className="mt-2 text-sm text-gray-600">Enter the card number to approve this request.</p>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded-md"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                    <button
                        onClick={handleApprove}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApproveModal;

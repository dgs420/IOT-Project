import React from "react";

const RequestDetailItem = ({ icon, label, value }) => {
    const isNotProvided = value === "Not provided" || value === "No number (Unknown type)";

    return (
        <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
                {icon}
                <span className="ml-2">{label}</span>
            </dt>
            <dd className={`mt-1 text-sm ${isNotProvided ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                {value}
            </dd>
        </div>
    );
};

export default RequestDetailItem;
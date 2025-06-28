import React, {useEffect, useState} from 'react';
import {fetchData} from "../../../../api/fetchData.js";

const DeviceActivity = ({embedId}) => {
    const [events, setEvents] = useState([]); // State to store MQTT events

    useEffect(() => {
        fetchData(`/logs/all-logs?embed_id=${embedId}`, setEvents);
    }, [embedId]);

    return (
        <div className="border rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Card Number</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Vehicle Plate</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Time</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {events.length > 0 ? (
                    events.slice().map((event, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition duration-200">
                            <td className="px-4 py-2 text-sm text-gray-700">{event?.card_number}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{event?.vehicle_plate}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                                         <span
                                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                 event.action === 'enter'
                                                     ? 'bg-green-100 text-green-700'
                                                     : 'bg-blue-100 text-blue-700'
                                             }`}>
                                            {event.action}
                                         </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                                          <span
                                              className={`text-sm ${
                                                  event?.is_valid ? 'text-green-600' : 'text-red-600'
                                              }`}
                                          >
                                            {event?.details}
                                          </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{event?.time ? new Date(event.time).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="px-4 py-2 text-gray-500 text-center">
                            No activities recorded yet.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DeviceActivity;
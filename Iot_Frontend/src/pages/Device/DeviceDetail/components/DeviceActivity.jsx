import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent } from "@mui/material";

const DeviceActivity = ({ embedId }) => {
    const [events, setEvents] = useState([]); // State to store MQTT events

    useEffect(() => {
        const socket = io('http://localhost:5000'); // Replace with your backend URL

        socket.on('mqttMessage', (data) => {
            console.log('Received MQTT Message:', data);

            // Update events if the embed_id matches the specified device's embed_id
            if (data.embed_id === embedId) {
                setEvents((prevEvents) => {
                    const updatedEvents = [...prevEvents, data].slice(-10); // Keep only the last 10 events
                    return updatedEvents;
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [embedId]); // Add embedId as a dependency

    return (
        <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Device Activity</h2>
                <div className="border rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Card Number</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Vehicle Number</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {events.length > 0 ? (
                            events.slice().reverse().map((event, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-2 text-sm text-gray-700">{event.card_number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{event.vehicle_number}</td>
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
                                         <span className={`text-sm ${
                                             event.message.includes('Invalid') || event.message.includes('not found')
                                                 ? 'text-red-600'
                                                 : 'text-green-600'
                                         }`}>
                                            {event.message}
                                         </span>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-2 text-gray-500 text-center">No events received
                                    yet.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
);
};

export default DeviceActivity;
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {io} from "socket.io-client";
import {Card, CardContent} from "@mui/material";


const ActivityLog = () => {
    const [events, setEvents] = useState([]); // State to store MQTT events

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('mqttEvents')) || [];
        setEvents(storedEvents.slice(-10)); // Only keep the last 5 events

        const socket = io('http://localhost:5000'); // Replace with your backend URL

        socket.on('mqttMessage', (data) => {
            console.log('Received MQTT Message:', data);

            setEvents((prevEvents) => {
                const updatedEvents = [...prevEvents, data].slice(-10); // Keep only the last 5 events
                localStorage.setItem('mqttEvents', JSON.stringify(updatedEvents)); // Save to local storage
                return updatedEvents;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Gate Activity</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Embed ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Card Number</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {events.length > 0 ? (
                            events.slice().reverse().map((event, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        <Link to={`/device/${event.embed_id}`}>
                                            {event.embed_id}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{event.card_number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{event.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{event.message}</td>
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
    )
        ;
};
export default ActivityLog;
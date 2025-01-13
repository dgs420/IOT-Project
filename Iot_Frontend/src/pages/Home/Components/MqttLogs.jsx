import React, { useEffect, useState } from 'react';

const MqttLogs = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000'); // Adjust the WebSocket URL as needed

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            setMessages((prevMessages) => [...prevMessages, data]);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h2>Real-Time MQTT Messages</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>Topic:</strong> {message.topic} | <strong>Message:</strong> {message.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MqttLogs;

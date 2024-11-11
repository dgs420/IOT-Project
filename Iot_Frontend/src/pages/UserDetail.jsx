import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Card, CardContent, CardHeader} from "@mui/material";
import withWidth from "@mui/material/Hidden/withWidth.js";

const UserDetail = () => {
    const {user_id} = useParams(); // Get the userId from the URL
    const [rfidCards, setRfidCards] = useState([]);
    const fetchRfidCards = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/card/user-card/${user_id}`);
            // if (!response.ok) throw new Error('Failed to fetch RFID cards');
            console.log(response);
            const data = await response.json();
            setRfidCards(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchRfidCards();
    }, [user_id]);

    return (
        <div className={'w-full p-4'}>
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <p className="mb-6">User ID: {user_id}</p>

            <h3 className="text-xl font-semibold mb-4">RFID Cards</h3>
            <div className="flex flex-wrap gap-4 mx-4">
                {rfidCards.length > 0 ? (
                    rfidCards.map((card) => (
                        <Card
                            key={card.card_id}
                            className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-lg p-4"
                        >
                            <CardHeader title={`Card ID: ${card.card_id}`}/>
                            <CardContent>
                                <p className="text-gray-700">
                                    <strong>Card Number:</strong> {card.card_number}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Vehicle Number:</strong> {card.vehicle_number || 'No vehicle linked'}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Vehicle Type:</strong> {card.vehicle_type || 'No vehicle linked'}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Status:</strong> {card.status}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No RFID cards found for this user.</p>
                )}
            </div>
        </div>
    )
        ;
};

export default UserDetail;

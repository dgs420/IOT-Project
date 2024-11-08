import React, {useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { user_id } = useParams(); // Get the userId from the URL
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
        <div>
            <h2>User Details</h2>
            <p>User ID: {user_id}</p>
            {/* Fetch and display user details based on the userId */}
            <h3>RFID Cards</h3>
            {rfidCards.length > 0 ? (
                <ul>
                    {rfidCards.map((card) => (
                        <li key={card.card_id}>
                            <p>Card ID: {card.card_id}</p>
                            <p>Card Number: {card.card_number}</p>
                            <p>Vehicle Number: {card.vehicle_number || 'No vehicle linked'}</p>
                            <p>Vehicle Type: {card.vehicle_type || 'No vehicle linked'}</p>
                            <p>Status: {card.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No RFID cards found for this user.</p>
            )}
        </div>
    );
};

export default UserDetail;

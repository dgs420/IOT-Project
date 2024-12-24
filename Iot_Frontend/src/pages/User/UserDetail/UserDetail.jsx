import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Box, Button, Card, CardContent, CardHeader, Input, Modal, TextField} from "@mui/material";
import {getRequest, postRequest} from "../../../api/index.js";
import SelectInput from "@mui/material/Select/SelectInput.js";

const UserDetail = () => {
    const {user_id} = useParams(); // Get the userId from the URL
    const [rfidCards, setRfidCards] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState(null);

    const [newCard, setNewCard] = useState({
        card_number: '',
        user_id,
        status: 'exited',
        vehicle_number: '',
        vehicle_type: 'car'
    });
    const [userDetails, setUserDetails] = useState([]);
    const [userLogs, setUserLogs] = useState([]);
    // const fetchUserLogs = async () => {
    //     try{
    //         const response: = await fetch()
    //     }
    // }
    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewCard({...newCard, [name]: value});
    };
    const fetchRfidCards = async () => {
        try {
            const response = await getRequest(`/card/user-card/${user_id}`);
            console.log(response);
            // const data = await response.json();
            if (response.code === 200) {
                setRfidCards(response.info);
            } else
                console.error(response.message);
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    const fetchUserDetail = async () => {
        try {
            const response = await getRequest(`/user/user-detail/${user_id}`);
            console.log(response);
            // const data = await response.json();
            if (response.code === 200) {
                setUserDetails(response.info);
            } else
                console.error(response.message);
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postRequest('/card/create-card', newCard); // Adjust the endpoint as necessary
            if (!response.ok) console.error('Error:', response);

            await fetchRfidCards(); // Refresh the list of RFID cards
            handleModalClose(); // Close the modal
        } catch (error) {
            console.log(error);
            console.error('Error adding RFID card:', error);
        }
    };
    useEffect(() => {
        fetchRfidCards();
        fetchUserDetail();
    }, [user_id]);

    return (
        <div className={'w-full p-4'}>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-semibold mb-6">User Details</h1>

                <form className="space-y-6 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <Input placeholder="Username" value={userDetails.username}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <Input placeholder="email" value={userDetails.email}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        {/*<SelectInput defaultValue="four-wheeler">*/}
                        {/*    <SelectTrigger>*/}
                        {/*        <SelectValue placeholder="Select category"/>*/}
                        {/*    </SelectTrigger>*/}
                        {/*    <SelectContent>*/}
                        {/*        <SelectItem value="two-wheeler">Two Wheeler</SelectItem>*/}
                        {/*        <SelectItem value="three-wheeler">Three Wheeler</SelectItem>*/}
                        {/*        <SelectItem value="four-wheeler">Four Wheeler</SelectItem>*/}
                        {/*    </SelectContent>*/}
                        {/*</SelectInput>*/}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <Input placeholder="First name" value={userDetails.first_name}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last name
                        </label>
                        <Input placeholder="Last name" value={userDetails.last_name}/>
                    </div>

                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                        Submit
                    </Button>
                </form>
            </div>

            {/*<h2 className="text-2xl font-semibold mb-4">User Details</h2>*/}
            {/*<p className="mb-6">User ID: {user_id}</p>*/}
            {/*<p className="mb-6">Username: {userDetails.username}</p>*/}
            {/*<p className="mb-6">Email: {userDetails.email}</p>*/}
            {/*<p className="mb-6">Role: {userDetails.role}</p>*/}
            {/*<p className="mb-6">First name: {userDetails.first_name}</p>*/}
            {/*<p className="mb-6">Last name: {userDetails.last_name}</p>*/}

            <h3 className="text-xl font-semibold mb-4 my-4">Registered Cards</h3>
            <div className="my-4 mx-4">
                <Button variant="contained" color="primary" onClick={handleModalOpen}>
                    Add RFID Card
                </Button>
            </div>


            <div className="flex flex-wrap gap-4 mx-4">
                {rfidCards.length > 0 ? (
                    rfidCards.map((card) => (
                        <Card
                            key={card.card_id}
                            className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-lg p-4"
                        >
                            <Link style={{textDecoration: 'none'}} to='/test-list'>
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
                            </Link>
                        </Card>
                    ))
                ) : (
                    <p>No RFID cards found for this user.</p>
                )}
            </div>

            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <h2>Add RFID Card</h2>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Card Number"
                            name="card_number"
                            value={newCard.card_number}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Vehicle Number"
                            name="vehicle_number"
                            value={newCard.vehicle_number}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Vehicle Type"
                            name="vehicle_type"
                            value={newCard.vehicle_type}
                            onChange={handleInputChange}
                            select
                            fullWidth
                        >
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                            <option value="others">Others</option>
                        </TextField>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Add Card
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>

    )
        ;
};

export default UserDetail;

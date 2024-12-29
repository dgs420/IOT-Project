import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Input,
    Modal,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem
} from "@mui/material";
import { getRequest, postRequest, deleteRequest } from "../../../api/index.js";
import { toast } from "react-toastify";

const UserDetail = () => {
    const { user_id } = useParams(); // Get the userId from the URL
    const [rfidCards, setRfidCards] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [newCard, setNewCard] = useState({
        card_number: '',
        user_id,
        status: 'exited',
        vehicle_number: '',
        vehicle_type: 'car'
    });
    const [userDetails, setUserDetails] = useState([]);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCard({ ...newCard, [name]: value });
    };

    const fetchRfidCards = async () => {
        try {
            const response = await getRequest(`/card/user-card/${user_id}`);
            if (response.code === 200) {
                setRfidCards(response.info);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    const fetchUserDetail = async () => {
        try {
            const response = await getRequest(`/user/user-detail/${user_id}`);
            if (response.code === 200) {
                setUserDetails(response.info);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postRequest('/card/create-card', newCard); // Adjust the endpoint as necessary
            if (response.code === 200) {
                await fetchRfidCards(); // Refresh the list of RFID cards
                handleModalClose(); // Close the modal
                toast.success("New card added successfully.");
                fetchRfidCards();
            } else {
                toast.error(response.message);
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error adding RFID card:', error);
        }
    };

    const handleDeleteCard = (cardId) => {
        setCardToDelete(cardId);
        setConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteRequest(`/card/${cardToDelete}`); // Adjust the endpoint as necessary
            if (response.code === 200) {
                toast.success("Card deleted successfully.");
                await fetchRfidCards(); // Refresh the list of RFID cards
            } else {
                toast.error(response.message);
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        } finally {
            setConfirmDeleteModal(false);
            setCardToDelete(null);
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
                <form className="space-y-6 max-w-2xl"
                      // onSubmit={}
                >

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <Input placeholder="Username" value={userDetails.username} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input placeholder="Email" value={userDetails.email} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <Input placeholder="First Name" value={userDetails.first_name} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <Input placeholder="Last Name" value={userDetails.last_name} readOnly />
                    </div>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">Submit</Button>
                </form>
            </div>

            <h3 className="text-xl font-semibold mb-4 my-4">Registered Cards</h3>
            <div className="my-4 mx-4">
                <Button variant="contained" color="primary" onClick={handleModalOpen}>
                    Add RFID Card
                </Button>
            </div>

            <div className="flex flex-wrap gap-4 mx-4">
                {rfidCards.length > 0 ? (
                    rfidCards.map((card) => (
                        <Card key={card.card_id} className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-lg p-4">
                            {/*<Link style={{ textDecoration: 'none' }} to='/test-list'>*/}
                                <CardHeader title={`Card ID: ${card.card_id}`} />
                                <CardContent>
                                    <p className="text-gray-700"><strong>Card Number:</strong> {card.card_number}</p>
                                    <p className="text-gray-700"><strong>Vehicle Number:</strong> {card.vehicle_number || 'No vehicle linked'}</p>
                                    <p className="text-gray-700"><strong>Vehicle Type:</strong> {card.vehicle_type || 'No vehicle linked'}</p>
                                    <p className="text-gray-700"><strong>Status:</strong> {card.status}</p>
                                    <div className="mt-4" >
                                        <Button variant="contained" color="error" onClick={() => handleDeleteCard(card.card_id)}>
                                            Delete Card
                                        </Button>
                                    </div>

                                </CardContent>
                            {/*</Link>*/}
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
                            required
                        >
                            <MenuItem value="car">Car</MenuItem>
                            <MenuItem value="bike">Bike</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                        </TextField>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Add Card
                        </Button>
                    </form>
                </Box>
            </Modal>

            {/* Confirmation Delete Modal */}
            <Dialog open={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this card?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteModal(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserDetail;
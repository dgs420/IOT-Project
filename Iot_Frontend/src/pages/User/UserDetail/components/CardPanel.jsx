// components/RfidCardsPanel.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Box, Modal, TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { getRequest, postRequest, deleteRequest } from "../../../../api/index.js";
import { toast } from "react-toastify";
import CardItem from './CardItem';

const CardsPanel = ({ userId }) => {
    const [rfidCards, setRfidCards] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [newCard, setNewCard] = useState({
        card_number: '',
        user_id: userId,
        status: 'exited',
        vehicle_number: '',
        vehicle_type: 'car'
    });

    const fetchRfidCards = async () => {
        try {
            const response = await getRequest(`/card/user-card/${userId}`);
            if (response.code === 200) {
                setRfidCards(response.info);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error);
        }
    };

    useEffect(() => {
        fetchRfidCards();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCard({ ...newCard, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postRequest('/card/create-card', newCard);
            if (response.code === 200) {
                await fetchRfidCards();
                setOpenModal(false);
                toast.success("New card added successfully.");
                // Reset form
                setNewCard({
                    card_number: '',
                    user_id: userId,
                    status: 'exited',
                    vehicle_number: '',
                    vehicle_type: 'car'
                });
            } else {
                toast.error(response.message);
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error adding RFID card:', error);
            toast.error("Failed to add new card");
        }
    };

    const handleDeleteCard = (cardId) => {
        setCardToDelete(cardId);
        setConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteRequest(`/card/${cardToDelete}`);
            if (response.code === 200) {
                toast.success("Card deleted successfully.");
                await fetchRfidCards();
            } else {
                toast.error(response.message);
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            toast.error("Failed to delete card");
        } finally {
            setConfirmDeleteModal(false);
            setCardToDelete(null);
        }
    };

    return (
        <div className="px-4 py-4">
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                Add RFID Card
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {rfidCards.length > 0 ? (
                    rfidCards.map(card => (
                        <CardItem
                            key={card.card_id}
                            card={card}
                            onDelete={handleDeleteCard}
                        />
                    ))
                ) : (
                    <p>No RFID cards found for this user.</p>
                )}
            </div>

            {/* Add RFID Card Modal */}
            <AddCardModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                newCard={newCard}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
            />

            {/* Confirmation Delete Modal */}
            <ConfirmDeleteModal
                open={confirmDeleteModal}
                onClose={() => setConfirmDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

// Modal for adding new RFID card
// eslint-disable-next-line react/prop-types
const AddCardModal = ({ open, onClose, newCard, onInputChange, onSubmit }) => {
    return (
        <Modal open={open} onClose={onClose}>
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
                <form onSubmit={onSubmit}>
                    <TextField
                        label="Card Number"
                        name="card_number"
                        value={newCard.card_number}
                        onChange={onInputChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Vehicle Number"
                        name="vehicle_number"
                        value={newCard.vehicle_number}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Vehicle Type"
                        name="vehicle_type"
                        value={newCard.vehicle_type}
                        onChange={onInputChange}
                        select
                        fullWidth
                        required
                        margin="normal"
                    >
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="bike">Bike</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Add Card
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

// Modal for confirming deletion
const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete this card?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={onConfirm} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CardsPanel;
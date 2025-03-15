import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Input,
    MenuItem,
    Modal,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import {deleteRequest, getRequest, postRequest, putRequest} from "../../../api/index.js";
import {toast} from "react-toastify";
import {UserLog} from "./components/UserLog.jsx";

const UserDetail = () => {
    const {user_id} = useParams(); // Get the userId from the URL
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
    const [tabIndex, setTabIndex] = useState(0);


    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewCard({...newCard, [name]: value});
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
            const response = await postRequest('/card/create-card', newCard);
            if (response.code === 200) {
                await fetchRfidCards();
                handleModalClose();
                toast.success("New card added successfully.");
            } else {
                toast.error(response.message);
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error adding RFID card:', error);
        }
    };

    const handleUserInputChange = (e) => {
        const {name, value} = e.target;
        setUserDetails({...userDetails, [name]: value});
    };

    const handleDeleteCard = (cardId) => {
        setCardToDelete(cardId);
        setConfirmDeleteModal(true);
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await putRequest(`/user/user-update/${user_id}`, userDetails);
            if (response.code === 200) {
                toast.success("User details updated successfully.");
            } else {
                toast.error(response.message);
                console.error('Error updating user:', response);
                fetchUserDetail();
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
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
        <div className="flex-1 p-4">


            {/* User Details Form */}
            <Card className="mb-8">
                <CardHeader title="User Details"/>
                <CardContent className="space-y-4">
                    <form
                        onSubmit={handleUserUpdate}
                        className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <Input
                                    name="username"
                                    value={userDetails.username}
                                    onChange={handleUserInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={userDetails.email}
                                    onChange={handleUserInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <Input
                                    name="first_name"
                                    value={userDetails.first_name}
                                    onChange={handleUserInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <Input
                                    name="last_name"
                                    value={userDetails.last_name}
                                    onChange={handleUserInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    name="role"
                                    value={userDetails.role}
                                    onChange={handleUserInputChange}
                                    className="block w-1/2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-10"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" variant="contained" color="primary">Update</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Registered Cards */}
            <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
                <Tab label="RFID Cards"/>
                <Tab label="User Logs"/>
            </Tabs>

            {tabIndex === 0 && (
                <div className="mt-6">
                    <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                        Add RFID Card
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {rfidCards.length > 0 ? (
                            rfidCards.map(card => (
                                <Card key={card.card_id}>
                                    <CardContent>
                                        <div className="flex justify-between my-1">
                                            <span className=" text-gray-500">Card Number:</span>
                                            <span className="font-medium">{card.card_number}</span>
                                        </div>
                                        <div className="flex justify-between my-1">
                                            <span className=" text-gray-500">Vehicle Number:</span>
                                            <span
                                                className="font-medium">{card.vehicle_number || 'No vehicle linked'}</span>
                                        </div>
                                        <div className="flex justify-between my-1">
                                            <span className=" text-gray-500">Vehicle Type:</span>
                                            <span
                                                className="capitalize">{card.vehicle_type || 'No vehicle linked'}</span>
                                        </div>
                                        <div className="flex justify-between my-1">
                                            <span className="text-gray-500">Status:</span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 my-1 rounded-full font-medium ${
                                                    card.status === 'exited' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}
                                            >
    {card.status}
</span>

                                        </div>
                                        <div className="mt-4">
                                            <Button variant="contained" color="error"
                                                    onClick={() => handleDeleteCard(card.card_id)}>
                                                Delete Card
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p>No RFID cards found for this user.</p>
                        )}
                    </div>
                </div>
            )}

            {tabIndex === 1 && (
                <div className="mt-6">
                    <UserLog userId={user_id}/>
                </div>
            )}

            {/* Add RFID Card Modal */}
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
                    <Button onClick={() => setConfirmDeleteModal(false)} color="secondary">Cancel</Button>
                    <Button onClick={confirmDelete} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserDetail;
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {getRequest, postRequest} from "../../../api/index.js";
import {Box, Button, MenuItem, Modal, TextField} from "@mui/material";
import { LayoutDashboard, Car, Users, UserCircle, ClipboardList, ShoppingCart, Settings, Shield, Video, Clock, Building2, Wrench, MoreVertical } from 'lucide-react'

function DeviceList(props) {
    const [devices, setDevices] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [newDevice, setNewDevice] = useState({
        embed_id: '',
        location: '',
        type: 'both'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice({ ...newDevice, [name]: value });
    };

    const getAllDevices = async () => {
        try {
            const response = await getRequest('/device'); // Adjust URL as needed
            console.log(response);
            if (response.code===200){
                setDevices(response.info);
            } else
                console.error(response.message);
            // Set the fetched data to the logs state
        } catch (error) {
            console.error('Error fetching traffic logs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response= await postRequest('/device/create-device', newDevice); // Adjust the endpoint as necessary
            console.log("Here" + response);
            if (response.code===200){
                await getAllDevices();
            } else
                console.error(response.message);
            handleModalClose(); // Close the modal
        } catch (error) {
            console.log(error);
            console.error('Error adding RFID card:', error);
        }
    };
    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);


    useEffect(() => {
        getAllDevices();
        // setInterval(getTrafficLogs)

    }, []);
    return (
        <div className='px-4 py-4'>
            <div className="bg-white rounded-lg shadow border">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-semibold">All Devices</h2>
                    <div className="mx-1">
                        <Button variant="contained" color="primary" onClick={handleModalOpen}>
                            Add Device
                        </Button>
                    </div>
                </div>

                <table className="min-w-full bg-white border-gray-300">
                    <thead className='top-0 sticky'>
                    <tr className="bg-gray-100 text-gray-600">
                        <th className="py-3 px-4 border-b">ID</th>
                        <th className="py-3 px-4 border-b">Embed ID</th>
                        <th className="py-3 px-4 border-b">Location</th>
                        <th className="py-3 px-4 border-b">Type</th>
                        <th className="py-3 px-4 border-b">Status</th>
                        <th className="py-3 px-4 border-b">Last seen</th>
                        <th className="py-3 px-4 border-b">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {devices.map((device,index) => (
                        <tr key={device.device_id} className="hover:bg-gray-100 ">
                            <td className="py-2 px-4 border-b text-center">
                                {index+1}
                            </td>
                            <td className="py-2 px-4 border-b text-center">{device.embed_id}</td>
                            <td className="py-2 px-4 border-b text-center">{device.location}</td>
                            <td className="py-2 px-4 border-b text-center">{device.type}</td>
                            <td
                                className="py-2 px-4 border-b text-center font-medium"
                                style={{color: device.status === 'online' ? 'green' : 'red'}}
                            >
                                {device.status}
                            </td>
                            <td className="py-2 px-4 border-b text-center">{new Date(device.last_seen).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b text-center flex justify-between">
                                <Link
                                    className="py-2 text-center font-medium text-blue-500 "
                                    to={`/device/${device.device_id}`}>
                                    Detail
                                </Link>

                                <Link
                                    className="py-2 text-center font-medium text-red-600 px-1"
                                    to={`/device/${device.device_id}`}>
                                    Delete
                                </Link>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>

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
                        <h2>Add a device</h2>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Device ID"
                                name="embed_id"
                                value={newDevice.embed_id}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                style={{marginTop: '10px'}}
                            />
                            <TextField
                                label="Device Location"
                                name="location"
                                value={newDevice.location}
                                onChange={handleInputChange}
                                fullWidth
                                style={{marginTop: '10px'}}

                            />
                            <TextField
                                label="Device Type"
                                name="type"
                                value={newDevice.type} // Set the value of the select to newDevice.type
                                onChange={handleInputChange}
                                select
                                fullWidth
                                style={{marginTop: '10px'}}
                            >
                                {/* Use the MenuItem component for each option */}
                                <MenuItem value="entry">Entry</MenuItem>
                                <MenuItem value="exit">Exit</MenuItem>
                                <MenuItem value="both">Both</MenuItem>
                            </TextField>

                            <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '10px'}}>
                                Add Device
                            </Button>
                        </form>
                    </Box>
                </Modal>

            </div>
        </div>





    );
}

export default DeviceList;
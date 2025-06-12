import React, {useState} from 'react';
import {Box, Button, MenuItem, Modal, TextField} from "@mui/material";
import {postRequest} from "../../../../api/index.js";
import {fetchData} from "../../../../api/fetchData.js";
import {toast} from "react-toastify";
import {CustomButton} from "../../../../common/components/CustomButton.jsx";

function NewDeviceModal({open,onClose, onSuccess}) {
    const [newDevice, setNewDevice] = useState({
        embed_id: '',
        location: '',
        type: 'both'
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice({ ...newDevice, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response= await postRequest('/device/create-device', newDevice); // Adjust the endpoint as necessary
            if (response.code===200){
                onSuccess();
            } else{
                toast.error(response.message);
            }
            onClose(); // Close the modal
        } catch (error) {
            console.log(error);
            console.error('Error adding RFID card:', error);
        }
    };
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

                    <CustomButton
                        type="submit"
                        color="primary"
                        title="Add Device"
                        className="w-full mt-4 justify-center"
                    />
                    {/*<Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '10px'}}>*/}
                    {/*    Add Device*/}
                    {/*</Button>*/}
                </form>
            </Box>
        </Modal>
    );
}

export default NewDeviceModal;
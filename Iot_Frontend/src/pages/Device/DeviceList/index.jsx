import React, {useEffect, useState} from 'react';
import {deleteRequest} from "../../../api/index.js";
import {Modal as AntModal} from 'antd';
import {toast} from "react-toastify";
import {io} from "socket.io-client";
import {fetchData} from "../../../api/fetchData.js";
import NewDeviceModal from "./components/NewDeviceModal.jsx";
import PageContentHeader from "../../../common/components/PageContentHeader.jsx";
import {Box, IconButton} from "@mui/material";
import {Edit, Trash2} from "lucide-react";
import DeviceTable from "./components/DeviceTable.jsx";

function DeviceList() {
    const [devices, setDevices] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const handleDelete = async (deviceId) => {
        AntModal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this device?',
            onOk: async () => {
                try {
                    const response = await deleteRequest(`/device/${deviceId}`);
                    if (response.code === 200) {
                        toast.success('Device deleted successfully');
                        await fetchData('/device', setDevices, null, null);
                    } else {
                        toast.error(response.message || 'Failed to delete device');
                    }
                } catch (error) {
                    console.error('Error deleting device:', error);
                    toast.error('An error occurred while deleting the device');
                }
            },
            onCancel() {
                console.log('Device deletion cancelled');
            },
        });
    };

    useEffect(() => {
        void fetchData('/device', setDevices, null, null);
        const socket = io('http://localhost:5000'); // Replace with your backend URL

        socket.on('deviceStatus', (data) => {
            console.log('Received MQTT Message:', data);

            void fetchData('/device', setDevices, null, null);
        });

        return () => {
            socket.disconnect();
        };
        // setInterval(getTrafficLogs)

    }, []);
    return (
        <Box>
            <PageContentHeader
                label="Devices"
                description={'Manage all registered devices'}
                buttonLabel="Add Device"
                onClick={handleModalOpen}
                className={'mb-4'}
            />
            <DeviceTable devices={devices} setDevices={setDevices} />
            <NewDeviceModal
                open={openModal}
                onClose={handleModalClose}
                onSuccess={() => void fetchData('/device', setDevices, null, null)}
            />
        </Box>


    );
}

export default DeviceList;
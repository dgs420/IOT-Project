import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Box, Button, Card, CardContent, CardHeader, Modal, TextField} from "@mui/material";
import {getRequest} from "../../../api/index.js";

const DeviceDetail = () => {
    const {deviceId} = useParams(); // Get the userId from the URL
    const [deviceDetails, setDeviceDetails] = useState([]);



    const fetchDeviceDeetails = async () => {
        try {
            const response = await getRequest(`/device/${deviceId}`);
            console.log(response);
            // const data = await response.json();
            if(response.code===200){
                setDeviceDetails(response.info);
            } else
                console.error(response.message);
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };



    useEffect(() => {
        fetchDeviceDeetails();
    }, [deviceId]);

    return (
        <div className={'w-full p-4'}>
            <h2 className="text-2xl font-semibold mb-4">Device Details</h2>
            {/*<p className="mb-6">ID: {deviceDetails.device_id}</p>*/}
            <p className="mb-6">Embed Id: {deviceDetails.embed_id}</    p>
            <p className="mb-6">Location: {deviceDetails.location}</p>
            <p className="mb-6">Status: {deviceDetails.status}</p>
            <p className="mb-6">Type: {deviceDetails.type}</p>
            <p className="mb-6">Last seen: {deviceDetails.last_seen}</p>
        </div>

    )
        ;
};

export default DeviceDetail;

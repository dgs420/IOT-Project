import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Box, Button, Card, CardContent, CardHeader, Input, Modal, TextField} from "@mui/material";
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

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-semibold mb-6">Device Details</h1>

                <form className="space-y-6 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Embed Id
                        </label>
                        <Input placeholder="Username" value={deviceDetails.embed_id}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <Input placeholder="email"  value={deviceDetails.location}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
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
                        <label>
                            {deviceDetails.type}
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <label style={{color: deviceDetails.status === 'online' ? 'green' : 'red'}}>
                            {deviceDetails.status}
                            </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last seen
                        </label>
                        <Input placeholder="Last name" value={new Date(deviceDetails.last_seen).toLocaleString()}/>
                    </div>

                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                        Submit
                    </Button>
                </form>
            </div>
        </div>

    )
        ;
};

export default DeviceDetail;

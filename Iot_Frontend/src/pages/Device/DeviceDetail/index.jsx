import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button, Input} from "@mui/material";
import {getRequest, postRequest} from "../../../api/index.js";
import {toast} from 'react-toastify';
import DeviceActivity from "./components/DeviceActivity.jsx";
import {io} from "socket.io-client";
import CustomToast from "./components/CustomToast.jsx"
const DeviceDetail = () => {
    const {embedId} = useParams(); // Get the userId from the URL
    const [deviceDetails, setDeviceDetails] = useState([]);
    const [socket, setSocket] = useState(null);
    const [customToast, setCustomToast] = useState(null);

    const fetchDeviceDetails = async () => {
        try {
            const response = await getRequest(`/device/embed/${embedId}`);
            console.log(response);
            // const data = await response.json();
            if (response.code === 200) {
                setDeviceDetails(response.info);
            } else
                console.error(response.message);
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    const handleDeviceCommand = async (command) => {
        try {
            const response = await postRequest(`/device/command`, {embed_id: deviceDetails.embed_id, command});
            if (response.code === 200) {
                toast.success(response.message);
                console.log(`Command "${command}" sent successfully.`);
            } else {
                toast.error(response.message);
                console.error(`Failed to send command: ${response.message}`);
            }
        } catch (error) {
            toast.error(error.message);
            console.error('Error:', error);
        }
    };

    const playAlertSound = () =>{
        const audio = new Audio("../../../public/sounds/AccessDenied");
        audio.play();
    }

    useEffect(() => {
        fetchDeviceDetails();
        const newSocket = io('http://localhost:5000'); // Replace with your backend URL
        setSocket(newSocket);
        newSocket.emit("join_gate", 'device01');

        // Listen for scan updates for this gate
        newSocket.on("scan", (data) => {
            // setStatus(data);
            console.log(data);
            setCustomToast({
                message: data.message,
                type: data.success ? "success" : "error"
            });


        });
        return () =>{
            newSocket.off("scan");
            newSocket.disconnect();
        }
    }, [embedId]);

    return (
        <>
            <div className="w-full h-12 mb-4 flex items-center justify-center">
                {customToast && <CustomToast message={customToast.message} type={customToast.type} onClose={() => setCustomToast(null)}/>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-xl font-semibold mb-6">Device Details</h1>

                        <form className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Embed Id
                                </label>
                                <span>{deviceDetails.embed_id}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <Input placeholder="email" value={deviceDetails.location}/>
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
                                <span>
                                    {deviceDetails.last_seen ? new Date(deviceDetails.last_seen).toLocaleString() : 'N/A'}
                                </span>
                            </div>

                            <Button type="submit" className="bg-green-500 hover:bg-green-600">
                                Submit
                            </Button>

                            <div className="flex space-x-4">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleDeviceCommand('enter')}
                                >
                                    Open Enter
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeviceCommand('exit')}
                                >
                                    Open Exit
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
                <div className="col-span-2">
                    <DeviceActivity embedId={deviceDetails.embed_id}/>
                </div>
            </div>
        </>
    );
};

export default DeviceDetail;

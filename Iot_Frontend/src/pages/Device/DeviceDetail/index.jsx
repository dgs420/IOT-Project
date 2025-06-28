import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Paper, Tab, Tabs, Typography} from "@mui/material";
import {getRequest, postRequest} from "../../../api/index.js";
import {toast} from 'react-toastify';
import DeviceActivity from "./components/DeviceActivity.jsx";
import {Activity, DollarSign, Info, Settings} from "lucide-react"
import PageContentHeader from "../../../common/components/PageContentHeader.jsx";
import TransactionsTable from "../../../common/components/TransactionsTable.jsx";
import DeviceDetails from "./components/DeviceDetails.jsx";
import ActivityList from '@/common/components/ActivityTable.jsx';

const DeviceDetail = () => {
    const {embedId} = useParams();
    const [deviceDetails, setDeviceDetails] = useState({
        embed_id: '',
        name: '',
        type: '',
        status: '',
        last_seen: ''
    });
    const [activeTab, setActiveTab] = useState(0)
    const fetchDeviceDetails = async () => {
        try {
            const response = await getRequest(`/device/embed/${embedId}`);
            // const data = await response.json();
            if (response.code === 200) {
                setDeviceDetails(response.info);
            } else
                console.error(response.message);
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    }
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

    useEffect(() => {
        fetchDeviceDetails();
    }, [embedId]);

    return (
        <>
            <div>
                <PageContentHeader
                    label={`Device ${embedId}`}
                    description="View and manage device information."
                />

                <Paper sx={{my: 3}}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{borderBottom: 1, borderColor: "divider"}}
                    >
                        <Tab icon={<Info size={18}/>} label="Information"/>
                        <Tab icon={<Activity size={18}/>} label="Activity"/>
                        <Tab icon={<DollarSign size={18}/>} label="Revenue"/>
                        <Tab icon={<Settings size={18}/>} label="Settings"/>
                    </Tabs>

                    <Box sx={{p: 3}}>
                        {activeTab === 0 && (
                            <DeviceDetails embedId={embedId}/>
                        )}

                        {activeTab === 1 && <ActivityList embedId={embedId}/>}

                        {activeTab === 2 && <TransactionsTable embedId={embedId} userId={""}/>
                        }

                        {activeTab === 3 && <Typography>Device settings would be displayed here</Typography>}
                    </Box>
                </Paper>
            </div>
            {/*<div className="w-full h-12 mb-4 flex items-center justify-center">*/}
            {/*    {customToast && <CustomToast message={customToast.message} type={customToast.type} onClose={() => setCustomToast(null)}/>}*/}
            {/*</div>*/}
        </>
    );
};

export default DeviceDetail;

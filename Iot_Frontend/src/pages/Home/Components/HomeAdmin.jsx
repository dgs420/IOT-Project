import React, {useEffect, useState} from 'react'
import VehiclesPieChart from "./VehiclesPieChart.jsx";
import { Car, Users, ClipboardList, DollarSign, LogOut, LogIn } from 'lucide-react'
import {Card, CardContent} from "@mui/material";
import {FaCar} from "react-icons/fa";
import {getRequest} from "../../../api/index.js";
import ActivityLog from "./ActivityLog.jsx";


const HomeAdmin = () => {
    const [homeData, setHomeData] = useState({
        "total_vehicles": 0,
        "vehicles_in": 0,
        "vehicles_exited": 0
    });
    const getHomeCount = async() =>{
        try {
            const response = await getRequest('/home'); // Adjust URL as needed
            console.log(response);
            if (response.code===200){
                setHomeData(response.info);
            } else
                console.error(response.message);
            // Set the fetched data to the logs state
        } catch (error) {
            console.error('Error fetching traffic logs:', error);
        }
    }

    useEffect(() => {
        getHomeCount();
        // console.log( 'Token: ' + localStorage.getItem('token'));
    }, []);
    return (
        <div className='px-3 py-3'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                    {title: "TOTAL VEHICLES REGISTERED", value: homeData.total_vehicles, icon: Car},
                    {title: "VEHICLES IN", value: homeData.vehicles_in, icon: LogIn},
                    {title: "VEHICLES OUT", value: homeData.vehicles_exited, icon: LogOut},
                    {title: "PARKING DONE WITHIN 24 HRS", value: "0", icon: ClipboardList},
                ].map((item, index) => (
                    <Card key={index}>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="mb-2">
                                <item.icon className="w-8 h-8 text-blue-500"/>
                            </div>
                            <h2 className="text-4xl font-bold mb-2">{item.value}</h2>
                            <p className="text-sm text-gray-500 text-center">{item.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <VehiclesPieChart/>
                </div>
                <div className="col-span-2 ">
                    <ActivityLog/>
                </div>
            </div>


        </div>
    );
};

export default HomeAdmin

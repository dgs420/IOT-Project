import React, {useEffect, useState} from 'react'
import VehiclesPieChart from "./VehiclesPieChart.jsx";
import { Car, Users, ClipboardList, DollarSign, LogOut, LogIn } from 'lucide-react'
import {Card, CardContent} from "@mui/material";
import {FaCar} from "react-icons/fa";
import {getRequest} from "../../../api/index.js";
// import {getRequest} from "../../api/index.js";


const HomeUser = () => {
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
        <div className='px-3 py-3'></div>
    );
};

export default HomeUser

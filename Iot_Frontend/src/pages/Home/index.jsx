import React, {useEffect, useState} from 'react'
import VehiclesPieChart from "./Components/VehiclesPieChart.jsx";
import { Car, Users, ClipboardList, DollarSign, LogOut, LogIn } from 'lucide-react'
import {Card, CardContent} from "@mui/material";
import {FaCar} from "react-icons/fa";
import {getRequest} from "../../api/index.js";
import HomeAdmin from "./Components/HomeAdmin.jsx";
import HomeUser from "./Components/HomeUser.jsx";


const Home = () => {
    const role = localStorage.getItem('role');

    return (
        <>
            {role === 'admin' ? (
                <HomeAdmin/>
            ) : (
                <HomeUser/>
            )}
        </>
    );
};
export default Home

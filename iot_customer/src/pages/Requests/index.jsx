import React from 'react';
import {NavLink} from 'react-router-dom';
// import { FaChartLine, FaCog, FaFile, FaHome, FaInfoCircle, FaMicrochip, FaUser } from 'react-icons/fa';
import {BarChart, Home, Info, IdCard, Landmark, FileQuestion} from 'lucide-react'; // eslint-disable-next-line react/prop-types
const Request = () => {

    // const userLinks = userRole === 'admin' ? links.admin : links.user;
    return (

        <div className="w-64 bg-white fixed h-full border-r p-4">
            <div className="text-3xl font-bold text-blue-600 mb-10">Your Requests</div>

        </div>
    );
};

export default Request;

import React from 'react';
import {NavLink} from 'react-router-dom';
// import { FaChartLine, FaCog, FaFile, FaHome, FaInfoCircle, FaMicrochip, FaUser } from 'react-icons/fa';
import {BarChart, Home, Info, IdCard, Landmark, FileQuestion} from 'lucide-react'; // eslint-disable-next-line react/prop-types
const Sidebar = ({userRole}) => {
    const links =

        [
            {to: "/", icon: <Home/>, label: "Home"},
            {to: "/activity", icon: <BarChart/>, label: "Activity"},
            {to: "/your-cards", icon: <IdCard />, label: "Registered Vehicles" },
            {to: "/transactions", icon: <Landmark />, label: "Transactions" },
            {to:"/requests", icon:<FileQuestion/>, label: "Requests"},
            {to: "/about", icon: <Info/>, label: "About Us"},

        ]
    ;
    // const userLinks = userRole === 'admin' ? links.admin : links.user;
    return (

        <div className="w-64 bg-white fixed h-full border-r p-4">
            <div className="text-3xl font-bold text-blue-600 mb-10">ParkMag</div>
            <nav>
                {links.map(({to, icon, label}) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({isActive}) =>
                            `flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`
                        }
                    >
                        <span className="w-6 h-6 mr-4 ml-1 text-2xl">{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;

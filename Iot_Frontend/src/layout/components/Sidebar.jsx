import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home, Mail, ParkingSquare, CreditCard, BarChart,
    Server, Users, FileText, Settings, Info, Microchip
} from "lucide-react";const Sidebar = ({ userRole }) => {
    const links =  [
            { to: "/", icon: <Home />, label: "Home" }, // 🏠 Home icon
            { to: "/users-requests", icon: <Mail />, label: "User Requests" }, // 📩 Mail (for messages/requests)
            { to: "/parking-spaces", icon: <ParkingSquare />, label: "Parking Spaces" }, // 🅿️ Parking icon
            { to: "/users-cards", icon: <CreditCard />, label: "Registered Cards" }, // 💳 Credit card icon
            { to: "/details", icon: <BarChart />, label: "Statistics" }, // 📊 Analytics/stats
            { to: "/device", icon: <Microchip />, label: "Devices" }, // 🖥️ Server for hardware/devices
            { to: "/users-list", icon: <Users />, label: "Users" }, // 👥 Multiple users icon
            { to: "/report", icon: <FileText />, label: "Report" }, // 📄 Document for reports
            { to: "/settings", icon: <Settings />, label: "Settings" }, // ⚙️ Classic settings icon
            { to: "/about", icon: <Info />, label: "About Us" }
        ]
    ;
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

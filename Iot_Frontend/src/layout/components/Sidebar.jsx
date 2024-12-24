import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaCog, FaFile, FaHome, FaInfoCircle, FaMicrochip, FaUser } from 'react-icons/fa';

const Sidebar = () => {
    const links = [
        { to: "/", icon: <FaHome />, label: "Home" },
        { to: "/details", icon: <FaChartLine />, label: "Statistic" },
        { to: "/device", icon: <FaMicrochip />, label: "Devices" },
        { to: "/users-list", icon: <FaUser />, label: "Users" },
        { to: "/report", icon: <FaFile />, label: "Report" },
        { to: "/settings", icon: <FaCog />, label: "Settings" },
        { to: "/about", icon: <FaInfoCircle />, label: "About Us" },
    ];

    return (
        <div className='w-64 bg-slate-900 fixed h-full py-2'>
            <h1 className='text-3xl text-white font-bold mx-3 my-2'> ParkMag </h1>
            <ul className='mt-3 text-black font-bold'>
                {links.map(({ to, icon, label }) => (
                    <li key={to} className='mb-2 rounded hover:bg-slate-800'>
                        <NavLink
                            to={to}
                            className={({ isActive }) =>
                                `px-3 py-2 font-semibold inline-flex items-center rounded transition-all duration-200 
                                ${
                                    isActive
                                        ? 'text-blue-400 '
                                        : 'text-white hover:text-blue-400'
                                }`
                            }
                        >
                            <span className='w-6 h-6 mr-4 ml-1 text-2xl'>{icon}</span>
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;

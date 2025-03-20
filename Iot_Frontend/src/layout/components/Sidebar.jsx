import React from 'react';
import { NavLink } from 'react-router-dom';
import {Home, BarChart, User, FileText, Settings, Info, Microchip} from 'lucide-react';// eslint-disable-next-line react/prop-types
const Sidebar = ({ userRole }) => {
    const links = {
        admin: [
            { to: "/", icon: <Home />, label: "Home" },
            { to: "/about", icon: <Info />, label: "User requests" },
            { to: "/about", icon: <Info />, label: "Parking spaces" },
            { to: "/about", icon: <Info />, label: "Registered cards" },
            { to: "/details", icon: <BarChart />, label: "Statistic" },
            { to: "/device", icon: <Microchip />, label: "Devices" },
            { to: "/users-list", icon: <User />, label: "Users" },
            { to: "/report", icon: <FileText />, label: "Report" },
            { to: "/settings", icon: <Settings />, label: "Settings" },
            { to: "/about", icon: <Info />, label: "About Us" },
        ],
        user: [
            { to: "/", icon: <Home />, label: "Home" },
            { to: "/details", icon: <BarChart />, label: "Statistic" },
            { to: "/about", icon: <Info />, label: "About Us" },
        ],
    };
    const userLinks = userRole === 'admin' ? links.admin : links.user;
    return (
        // <div className='w-64 bg-slate-900 fixed h-full py-2'>
        //     <h1 className='text-3xl text-white font-bold mx-3 my-2'> ParkMag </h1>
        //     <ul className='mt-3 text-black font-bold'>
        //         {userLinks.map(({ to, icon, label }) => (
        //             <li key={to} className='mb-2 rounded hover:bg-slate-800'>
        //                 <NavLink
        //                     to={to}
        //                     className={({ isActive }) =>
        //                         `px-3 py-2 font-semibold inline-flex items-center rounded transition-all duration-200
        //                         ${
        //                             isActive
        //                                 ? 'text-blue-400 '
        //                                 : 'text-white hover:text-blue-400'
        //                         }`
        //                     }
        //                 >
        //                     <span className='w-6 h-6 mr-4 ml-1 text-2xl'>{icon}</span>
        //                     {label}
        //                 </NavLink>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div className="w-64 bg-white fixed h-full border-r p-4">
            <div className="text-3xl font-bold text-blue-600 mb-10">ParkMag</div>
            <nav>
                {userLinks.map(({to, icon, label}) => (
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

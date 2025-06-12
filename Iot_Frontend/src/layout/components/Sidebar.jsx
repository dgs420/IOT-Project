import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Mail,
  ParkingSquare,
  CreditCard,
  BarChart,
  Users,
  FileText,
  Settings,
  Info,
  Microchip,
  Car, Clock,
} from "lucide-react";
import {FaParking} from "react-icons/fa";
const Sidebar = () => {
  const links = [
    { to: "/", icon: <Home />, label: "Home" },
    { to: "/users-requests", icon: <Mail />, label: "User Requests" },
    { to: "/parking-sessions", icon: <Clock />, label: "Parking Sessions" },
    { to: "/parking-spaces", icon: <ParkingSquare />, label: "Parking Spaces" },
    { to: "/users-cards", icon: <CreditCard />, label: "Registered Vehicles" },
    { to: "/transactions-dashboard", icon: <FileText />, label: "Transactions" },
    { to: "/details", icon: <BarChart />, label: "Statistics" },
    { to: "/device", icon: <Microchip />, label: "Devices" },
    { to: "/users-list", icon: <Users />, label: "Users" },
    { to: "/vehicle-types", icon: <Car />, label: "Vehicle Types" },
    { to: "/settings", icon: <Settings />, label: "Settings" },
    { to: "/about", icon: <Info />, label: "About Us" },
  ];
  return (
    <div className="w-64 bg-white fixed h-full border-r p-4">
      <div className="text-3xl font-bold text-blue-600 mb-10">ParkMag</div>
      <nav>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
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

import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import useUserStore from "../../store/useUserStore.js";

const UserDropdown = ({ username, showDropdown, setShowDropdown ,userInitial}) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const {clearUser, role} = useUserStore.getState();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowDropdown]);

    return (
        <div className="relative user-trigger">

            <button
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none ${
                    showDropdown ? "bg-gray-100" : ""
                }`}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div
                    className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {userInitial}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">{username}</p>
                    <p className="text-xs text-gray-500">User</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500"/>
            </button>
            {showDropdown && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <button onClick={() => navigate('/profile')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                    </button>
                    <button onClick={clearUser}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Log out
                    </button>

                </div>
            )}
        </div>
    );
};

export default UserDropdown;

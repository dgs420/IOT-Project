import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const UserDropdown = ({ username, showDropdown, setShowDropdown, handleLogout }) => {
    const dropdownRef = useRef(null);

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
        <div className="relative">
            <button onClick={() => setShowDropdown(prev => !prev)} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                <span>{username}</span>
                <ChevronDown className="text-gray-500" />
            </button>
            {showDropdown && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;

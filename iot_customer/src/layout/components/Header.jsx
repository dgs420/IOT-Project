import React, {useState} from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import {useNavigate} from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        // Redirect to login page
        navigate('/login');
    };

    const getHeaderTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/settings':
                return 'Settings';
            case '/device':
                return 'Devices list';
            case '/details':
                return 'Statistics';
            case '/report':
                return 'Log history';
            case '/users-list':
                return 'Users list';
            default:
                return null;
        }
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white border-b">
            <div className="relative">
                {/*<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />*/}
                <div className="relative">
                    <h3 className="text-xl font-bold text-gray-800">{getHeaderTitle()}</h3>
                </div>
                {/* <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 w-64" /> */}
            </div>
            <div className="flex items-center space-x-4">
                <Bell className="text-gray-500"/>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                    <span>{username}</span>
                    <ChevronDown
                        className="text-gray-500 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                </div>
                {showDropdown && (
                    <div className="absolute right-1 mt-20 w-40 bg-white border rounded shadow-lg z-50">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header

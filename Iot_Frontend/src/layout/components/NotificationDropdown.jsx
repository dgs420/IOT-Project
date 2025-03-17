import React, { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const NotificationDropdown = ({ notifications, toggleNotification, markAsRead, showNotification, unreadCount }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                toggleNotification(!toggleNotification);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [toggleNotification]);

    return (
        <div className="relative">
            <button onClick={toggleNotification} className="relative">
                <Bell className="text-gray-500 cursor-pointer" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
                )}
            </button>
            {showNotification && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
                    <ul className="max-h-48 overflow-auto">
                        {/* eslint-disable-next-line react/prop-types */}
                        {notifications.length > 0 ? (
                            // eslint-disable-next-line react/prop-types
                            notifications.map(notification => (
                                <li
                                    key={notification.id}
                                    className={`p-2 cursor-pointer ${notification.status === 'unread' ? 'bg-gray-100' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    {notification.message}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500">No notifications</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;

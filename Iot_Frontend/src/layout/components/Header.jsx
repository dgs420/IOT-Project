import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown.jsx";
import UserDropdown from "./UserDropdown.jsx";

const mockNotifications = [
  { id: 1, message: "Your vehicle card request has been approved.", status: "unread" },
  { id: 2, message: "Your vehicle card request has been rejected.", status: "read" },
  { id: 3, message: "New update available for your app.", status: "unread" },
];

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const toggleNotification = useCallback(() => {
    setShowNotification(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    ['token', 'uid', 'role', 'username'].forEach(item => localStorage.removeItem(item));
    navigate('/login');
  }, [navigate]);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
        prev.map(notification =>
            notification.id === id ? { ...notification, status: 'read' } : notification
        )
    );
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const getHeaderTitle = useCallback(() => {
    const titles = {
      '/': 'Dashboard',
      '/settings': 'Settings',
      '/device': 'Devices list',
      '/details': 'Statistics',
      '/report': 'Log history',
      '/users-list': 'Users list'
    };
    return titles[location.pathname] || 'Page';
  }, [location.pathname]);

  return (
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h3 className="text-xl font-bold text-gray-800">{getHeaderTitle()}</h3>
        <div className="flex items-center space-x-4">
          <NotificationDropdown
              notifications={notifications}
              toggleNotification={toggleNotification}
              markAsRead={markAsRead}
              showNotification={showNotification}
              unreadCount={unreadCount}
          />
          <UserDropdown
              username={username}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              handleLogout={handleLogout}
          />
        </div>
      </header>
  );
};

export default Header;

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Menu, X, Home, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown.jsx";
import useUserStore from '../../store/useUserStore.js';

const mockNotifications = [
  { id: 1, message: "Your vehicle card request has been approved.", status: "unread" },
  { id: 2, message: "Your vehicle card request has been rejected.", status: "read" },
  { id: 3, message: "New update available for your app.", status: "unread" },
];

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const {username, clearUser } = useUserStore.getState();

  const navigate = useNavigate();
  const location = useLocation();
  const userInitial = username.charAt(0).toUpperCase();

  const headerRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const toggleNotification = useCallback(() => {
    setShowNotification(prev => !prev);
    setShowDropdown(false);
  }, []);

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
      '/device': 'Devices List',
      '/details': 'Statistics',
      '/report': 'Log History',
      '/users-list': 'Users List',
      '/users-requests':'Users Request'
    };
    return titles[location.pathname] || 'Page';
  }, [location.pathname]);

  const generateBreadcrumbs = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return null;

    return (
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Link to="/" className="hover:text-blue-600 flex items-center">
            <Home className="h-3 w-3 mr-1" />
            <span>Home</span>
          </Link>

          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;
            const titles = {
              'settings': 'Settings',
              'device': 'Devices',
              'details': 'Statistics',
              'report': 'Log History',
              'users-list': 'Users'
            };

            return (
                <React.Fragment key={path}>
                  <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  {isLast ? (
                      <span className="font-medium text-gray-700 capitalize">
                                    {titles[segment] || segment}
                                </span>
                  ) : (
                      <Link to={path} className="hover:text-blue-600 capitalize">
                        {titles[segment] || segment}
                      </Link>
                  )}
                </React.Fragment>
            );
          })}
        </div>
    );
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowNotification(false);
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showMobileSearch) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMobileSearch]);

  return (
      <header
          ref={headerRef}
          className="sticky top-0 z-30 w-full bg-white border-b shadow-sm"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                  className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </button>

              <div className="ml-2 md:ml-0">
                <h1 className="text-xl font-semibold text-gray-800">{getHeaderTitle()}</h1>
                {!isMobile && generateBreadcrumbs()}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isMobile && (
                  <button
                      className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                      onClick={() => setShowMobileSearch(!showMobileSearch)}
                  >
                    {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    <span className="sr-only">
                                    {showMobileSearch ? "Close search" : "Open search"}
                                </span>
                  </button>
              )}


              {/*<NotificationDropdown*/}
              {/*    notifications={notifications}*/}
              {/*    toggleNotification={toggleNotification}*/}
              {/*    markAsRead={markAsRead}*/}
              {/*    showNotification={showNotification}*/}
              {/*    unreadCount={unreadCount}*/}
              {/*/>*/}

              <UserDropdown
                  username={username}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  userInitial={userInitial}
              />

            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
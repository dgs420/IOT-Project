import React from "react";

import Home from '../pages/Home';
import Statistics from '../pages/Statistics';
import PersonalProfile from '../pages/PersonalProfile';
import Report from '../pages/Report';
import Login from '../pages/Authen/Login';
import UserList from "../pages/User/UserList/UserList.jsx";
import UserDetail from "../pages/User/UserDetail/UserDetail.jsx";
import DeviceList from "../pages/Device/DeviceList/index.jsx";
import DeviceDetail from "../pages/Device/DeviceDetail/index.jsx";
import {UserRequests} from "../pages/Requests/index.jsx";
import VehicleTypeAdmin from "../pages/VehicleType/index.jsx";
import ParkingSpaceManagement from "../pages/ParkingSpace/ParkingSpace.jsx";
import { RegisteredVehicles } from '../pages/RegisteredVehicles/index.jsx';
import ParkingSessions from "../pages/ParkingSessions/index.jsx";
import TransactionsDashboard from "../pages/Transactions/index.jsx";
import { ForbiddenPage } from "../pages/Forbidden/index.jsx";

export const APP_ROUTES = [
    {
        key: 'home',
        path: '/',
        element: <Home />,
    },
    {
        key: 'details',
        path: '/details',
        element: <Statistics />,
    },
    {
        key: 'settings',
        path: '/settings',
        element: <p>settings</p>,
    },
    {
        key: 'about',
        path: '/about',
        element: <p>about</p>,
    },
    {
        key: 'profile',
        path: '/profile',
        element: <PersonalProfile />,
    },
    {
        key: 'users-list',
        path: '/users-list',
        element: <UserList />,
    },
    {
        key: 'user-detail',
        path: '/user/:user_id',
        element: <UserDetail />,
    },
    {
        key: 'device',
        path: '/device',
        element: <DeviceList />,
    },
    {
        key: 'device-detail',
        path: '/device/:embedId',
        element: <DeviceDetail />,
    },
    {
        key: 'report',
        path: '/report',
        element: <Report />,
    },
    {
        key: 'login',
        path: '/login',
        element: <Login />,
    },
    {
        key: 'users-requests',
        path: '/users-requests',
        element: <UserRequests />,
    },
    {
        key: 'vehicles',
        path: '/vehicles',
        element: <RegisteredVehicles />,
    },
    {
        key:'parking-spaces',
        path: '/parking-spaces',
        element: <ParkingSpaceManagement/>,
    },
    {
        key:'transactions-dashboard',
        path: '/transactions-dashboard',
        element: <TransactionsDashboard/>,
    },
    {
      key:'parking-sessions',
      path: '/parking-sessions',
      element: <ParkingSessions/>,
    },

    {
        key:'vehicle-types',
        path: '/vehicle-types',
        element: <VehicleTypeAdmin />,
    },
    {
        key:'forbidden',
        path: '/forbidden',
        element: <ForbiddenPage />,
    }
];
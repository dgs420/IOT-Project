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
import RegisteredCards from "../pages/RegisteredCards/index.jsx";
import VehicleTypeAdmin from "../pages/VehicleType/index.jsx";
import ParkingSpaceManagement from "../pages/ParkingSpace/ParkingSpace.jsx";
import { RegisteredVehicles } from '../pages/RegisteredVehicles/index.jsx';

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
        key: 'users-cards',
        path: '/users-cards',
        element: <RegisteredVehicles />,
    },
    {
        key:'parking-spaces',
        path: '/parking-spaces',
        element: <ParkingSpaceManagement/>,
    },
    {
        key:'vehicle-types',
        path: '/vehicle-types',
        element: <VehicleTypeAdmin />,
    }
];
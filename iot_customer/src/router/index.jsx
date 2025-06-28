import Home from '../pages/Home/Home.jsx';
import Login from "../pages/Auth/Login/index.jsx";
import Signup from "../pages/Auth/Signup/index.jsx";
import Activity from "../pages/Activity/index.jsx";
import PaymentSuccess from "../pages/PaymentResult/PaymentSuccess.jsx";
import Transactions from "../pages/Transactions/index.jsx";
import {UserVehicles} from "../pages/Vehicles/index.jsx";
import {UserRequests} from "../pages/Requests/index.jsx";
import ProfilePage from "../pages/Profile/index.jsx";
import AboutUs from '../pages/AboutUs/index.jsx';
// import Statistics from '../pages/Statistics';
// import PersonalProfile from '../pages/PersonalProfile';
// import Report from '../pages/Report';
// import Login from '../pages/Authen/Login';
// import UserList from "../pages/User/UserList/UserList.jsx";
// import UserDetail from "../pages/User/UserDetail/UserDetail.jsx";
// import DeviceList from "../pages/Device/DeviceList/index.js";
// import DeviceDetail from "../pages/Device/DeviceDetail/index.js";

export const APP_ROUTES = [
    {
        key: 'home',
        path: '/',
        element: <Home />,
    },
    {
        key: 'register',
        path: '/register',
        element: <Signup/>
    },
    {
        key:'payment-success',
        path: '/payment-success',
        element: <PaymentSuccess/>
    },
    {
        key: 'about',
        path: '/about',
        element: <AboutUs/>,
    },
    {
        key: 'profile',
        path: '/profile',
        element: <ProfilePage/>
        // <PersonalProfile />
        ,
    },
    {
        key: 'activity',
        path: '/activity',
        element: <Activity/>,
    },
    {
        key:'your-vehicles',
        path: '/your-vehicles',
        element: <UserVehicles />,

    },
    {
        key:'transactions',
        path: '/transactions',
        element: <Transactions/>,

    },
    {
        key:'requests',
        path: '/requests',
        element: <UserRequests/>,

    },
    // {
    //     key: 'users-list',
    //     path: '/users-list',
    //     element: <UserList />,
    // },
    // {
    //     key: 'user-detail',
    //     path: '/user/:user_id',
    //     element: <UserDetail />,
    // },
    // {
    //     key: 'device',
    //     path: '/device',
    //     element: <DeviceList />,
    // },
    // {
    //     key: 'device-detail',
    //     path: '/device/:embedId',
    //     element: <DeviceDetail />,
    // },
    // {
    //     key: 'report',
    //     path: '/report',
    //     element: <Report />,
    // },
    {
        key: 'login',
        path: '/login',
        element: <Login />,
    },
];
import Home from '../pages/Home/Home.jsx';
import Login from "../pages/Auth/Login/index.jsx";
import Signup from "../pages/Auth/Signup/index.jsx";
import Activity from "../pages/Activity/index.jsx";
import PaymentSuccess from "../pages/PaymentResult/PaymentSuccess.jsx";
import Transactions from "../pages/Transactions/index.jsx";
// import Statistics from '../pages/Statistics';
// import PersonalProfile from '../pages/PersonalProfile';
// import Report from '../pages/Report';
// import Login from '../pages/Authen/Login';
// import UserList from "../pages/User/UserList/UserList.jsx";
// import UserDetail from "../pages/User/UserDetail/UserDetail.jsx";
// import DeviceList from "../pages/Device/DeviceList/index.jsx";
// import DeviceDetail from "../pages/Device/DeviceDetail/index.jsx";

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
        element: <p>about</p>,
    },
    {
        key: 'profile',
        path: '/profile',
        element: <p>profile</p>
        // <PersonalProfile />
        ,
    },
    {
        key: 'profile',
        path: '/profile',
        element: <p>profile</p>
    },
    {
        key: 'activity',
        path: '/activity',
        element: <Activity/>,
    },
    {
        key:'your-cards',
        path: '/your-cards',
        element: <p>your-card</p>,

    },
    {
        key:'transactions',
        path: '/transactions',
        element: <Transactions/>,

    },
    {
        key:'requests',
        path: '/requests',
        element: <p>your request</p>,

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
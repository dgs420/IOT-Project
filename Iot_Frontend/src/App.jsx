import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from "./layout/index.jsx";
import Home from "./pages/Home/index.jsx";
import Login from "./pages/Authen/Login/index.jsx";
import Statistics from "./pages/Statistics/index.jsx";
import PersonalProfile from "./pages/PersonalProfile/index.jsx";
import UserList from "./pages/User/UserList/UserList.jsx";
import UserDetail from "./pages/User/UserDetail/UserDetail.jsx";
import DeviceList from "./pages/Device/DeviceList/index.jsx";
import DeviceDetail from "./pages/Device/DeviceDetail/index.jsx";
import Report from "./pages/Report/index.jsx";
import { APP_ROUTES } from './router/index.jsx';
import {ConfigProvider} from "antd";

export default function App() {
  return (

        <Router>
          <Routes>
            {APP_ROUTES.map((route) => (
                <Route
                    key={route.key}
                    path={route.path}
                    element={
                      route.path === '/login' ? (
                          route.element // Directly render Login without Layout
                      ) : (
                          <Layout>{route.element}</Layout> // Wrap other routes with Layout
                      )
                    }
                />
            ))}
            <Route path='*' element={<p>Not Found</p>} /> {/* You can replace with a NotFound component */}
          </Routes>
          <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
          />
        </Router>
  );
}


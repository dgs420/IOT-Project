import React, {useEffect} from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from "./layout/index.jsx";
import { APP_ROUTES } from './router/index.jsx';
import {NotFoundPage} from "./pages/NotFound/index.jsx";
// import {ConfigProvider} from "antd";

export default function App() {
    // const setVehicleTypes = useVehicleTypeStore((state) => state.setVehicleTypes);
    //
    // useEffect(() => {
    //     void fetchData('/vehicle-type', setVehicleTypes, null, null)
    // }, []);
    return (

        <Router>
            <Routes>
                {APP_ROUTES.map((route) => (
                    <Route
                        key={route.key}
                        path={route.path}
                        element={
                            route.path === '/login' || route.path === '/register' ?  (
                                route.element
                            ) : (
                                <Layout>
                                    {route.element}
                                </Layout>
                                    )
                                }
                                    />
                                    ))}
                                    <Route path='*' element={<NotFoundPage/>} />
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


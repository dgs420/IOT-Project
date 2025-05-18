import React, {useEffect} from 'react'
import Sidebar from './components/Sidebar.jsx'
import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import {useVehicleTypeStore} from "../store/useVehicleTypeStore.js";
import {fetchData} from "../api/fetchData.js";

const role = localStorage.getItem('role');
// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    const setVehicleTypes = useVehicleTypeStore((state) => state.setVehicleTypes);

    useEffect(() => {
        void fetchData('/vehicle-type', setVehicleTypes, null, null)
    }, []);
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar userRole={role} />
            <div className="flex-1 flex flex-col ml-64">
                <Header />
                <div className="flex-1 overflow-auto">
                    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    )
}

export default Layout
import React from 'react'
import Sidebar from './components/Sidebar.jsx'
import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'


const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
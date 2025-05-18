import React from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
        <Sidebar/>
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
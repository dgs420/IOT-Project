import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'


const Layout = () => {
  return (
    <div className='flex flex-row bg-neutral-100 h-100% w-screen overflow-hidden'>
      <Sidebar/>
      <div className="flex flex-col ml-72 w-full">
                <Header/>
                <Outlet />
            </div>
    </div>
  )
}

export default Layout
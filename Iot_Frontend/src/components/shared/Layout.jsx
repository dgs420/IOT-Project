import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'


const Layout = () => {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
      <Sidebar/>
      <div className="ml-80 p-4 w-full">
                <Outlet />
            </div>
    </div>
  )
}

export default Layout
import React from 'react'
import {FaChartLine, FaCog, FaHome, FaInfoCircle, FaUser} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='w-64 bg-slate-900 fixed h-full py-2 '>
            <div>
                <h1 className='text-2xl text-white font-bold  mx-3 mt-1 '> Dashboard</h1>
            </div>
            <ul className='mt-3 text-white font-bold '>
                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <Link to="/" className='px-3 font-semibold'>
                        <FaHome className='inline-block w-6 h-6 mr-2 -mt-2' />
                        Home
                    </Link>
                </li>
            </ul>
            <ul className='mt-3 text-white font-bold bg-gray-800'>
                <h1 className='text-xl text-white font-medium mx-3 py-3'> Thí nghiệm </h1>
                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <Link to="/details" className='px-3 font-semibold'>
                        <FaChartLine className='inline-block w-6 h-6 mr-2 -mt-2'/>
                        Statistic
                    </Link>
                </li>
                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <Link to="/settings" className='px-3 font-semibold'>
                        <FaCog className='inline-block w-6 h-6 mr-2 -mt-2'/>
                        Settings
                    </Link>
                </li>

                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <Link to="/users-list" className='px-3 font-semibold'>
                        <FaUser className='inline-block w-6 h-6 mr-2 -mt-2'/>
                        Users list
                    </Link>
                </li>

                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <Link to="/about" className='px-3 font-semibold'>
                        <FaInfoCircle className='inline-block w-6 h-6 mr-2 -mt-2'/>
                        About Us
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar

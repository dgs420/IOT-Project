import React from 'react'
import { FaChartLine, FaCog, FaHome, FaInfoCircle } from 'react-icons/fa'

const Sidebar = () => {
    return (
        <div className='w-80 bg-slate-900 fixed h-full py-2 '>
            <div >
                <h1 className='text-2xl text-white font-bold  mx-3 mt-1 '> Dashboard</h1>
            </div>
            {/* <hr className='my-3' /> */}
            <ul className='mt-3 text-white font-bold '>
                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <a href="" className='px-3 font-light'>
                        <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'>
                        </FaHome>
                        Home
                    </a>
                </li>
            </ul>
            <ul className='mt-3 text-white font-bold bg-gray-800'>
                <h1 className='text-xl text-white font-medium mx-3 py-3'> Thí nghiệm  </h1>
                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <a href="" className='px-3 font-light'>
                        <FaChartLine className='inline-block w-6 h-6 mr-2 -mt-2'>
                        </FaChartLine>
                        Details
                    </a>
                </li>

                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <a href="" className='px-3 font-light'>
                        <FaCog className='inline-block w-6 h-6 mr-2 -mt-2'>
                        </FaCog>
                        Settings
                    </a>
                </li>
    
                <li className='mb-2 rounded hover:shadow hover:text-blue-400 px-2 py-2'>
                    <a href="" className='px-3 font-light'>
                        <FaInfoCircle className='inline-block w-6 h-6 mr-2 -mt-2'>
                        </FaInfoCircle>
                        About us
                    </a>
                </li>
            </ul>

        </div>
    )
}

export default Sidebar

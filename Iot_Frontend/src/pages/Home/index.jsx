import React from 'react'
import DashBoard from '../Statistics/Components/DashBoard.jsx'
import { ActivityLog } from './Components/ActivityLog.jsx'

const Home = () => {
    return (
        <div>
            <div className='px-4 py-4'>
                <ActivityLog />

            </div>
            {/* <DashBoard /> */}

        </div>
    )
}

export default Home

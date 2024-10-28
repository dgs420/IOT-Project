import React from 'react'
import DashBoard from '../components/DashBoard'
import { ActivityLog } from '../components/ActivityLog'

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

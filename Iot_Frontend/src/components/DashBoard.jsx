import React from 'react'
import VehiclesPieChart from './VehiclesPieChart'
import { TrafficCard } from './TrafficCard'
import { HourlyChart } from './HourlyChart'
import { ActivityLog } from './ActivityLog'
// import ActivityLog from './ActivityLog'

const DashBoard = () => {
  return (
    <div className='px-3 py-3'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <DashBoardGrid /> */}
        
        <div className="lg:col-span-2">
          <TrafficCard />
        </div>
        <VehiclesPieChart />
      </div>
      <HourlyChart />


    </div>
    // <div className='flex flex-col gap-4'>

    // </div>
  )
}

export default DashBoard

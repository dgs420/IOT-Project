import React from 'react'
import DashBoardGrid from './DashBoardGrid'
import TrafficChart from './TrafficChart'
import VehiclesPieChart from './VehiclesPieChart'
import { TrafficCard } from './TrafficCard'

const DashBoard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3 py-3">
      {/* <DashBoardGrid /> */}
      <div className="lg:col-span-2">
        <TrafficCard />
      </div>
      <VehiclesPieChart />
    </div>
    // <div className='flex flex-col gap-4'>

    // </div>
  )
}

export default DashBoard

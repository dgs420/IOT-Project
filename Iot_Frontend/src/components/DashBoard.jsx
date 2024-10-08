import React from 'react'
import DashBoardGrid from './DashBoardGrid'
import TrafficChart from './TrafficChart'
import VehiclesPieChart from './VehiclesPieChart'

const DashBoard = () => {
  return (
    <div className='flex flex-col gap-4'>
      <DashBoardGrid/>
      <TrafficChart/>
      <VehiclesPieChart/>
    </div>
  )
}

export default DashBoard

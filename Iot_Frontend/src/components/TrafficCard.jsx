import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '@mui/material';


const data = [
  { day: 'Sun', enter: 200, exit: 180 },
  { day: 'Mon', enter: 150, exit: 130 },
  { day: 'Tue', enter: 200, exit: 190 },
  { day: 'Wed', enter: 175, exit: 160 },
  { day: 'Thur', enter: 250, exit: 240 },
  { day: 'Fri', enter: 300, exit: 280 },
  { day: 'Sat', enter: 275, exit: 260 },
];

export const TrafficCard = () => {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="text-3xl font-bold">IDR 7.852.000</div>
        <div className="text-green-500">↑ 2.1% vs last week</div>
        <div className="text-sm text-gray-500">Sales from 1-12 Dec, 2020</div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="enter" fill="#82ca9d" name="Vehicles Entering" />
            <Bar dataKey="exit" fill="#8884d8" name="Vehicles Leaving" />
          </BarChart>
        </ResponsiveContainer>
        {/* <div className="h-40 bg-gray-200 mt-4 rounded"></div> */}
      </CardContent>
    </Card>
  )
}

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '@mui/material';


const data = [
  { day: 'Mon', entering: 150, leaving: 130 },
  { day: 'Tue', entering: 200, leaving: 190 },
  { day: 'Wed', entering: 175, leaving: 160 },
  { day: 'Thur', entering: 250, leaving: 240 },
  { day: 'Fri', entering: 300, leaving: 280 },
  { day: 'Sat', entering: 275, leaving: 260 },
  { day: 'Sun', entering: 200, leaving: 180 },
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
            <Bar dataKey="entering" fill="#82ca9d" name="Vehicles Entering" />
            <Bar dataKey="leaving" fill="#8884d8" name="Vehicles Leaving" />
          </BarChart>
        </ResponsiveContainer>
        {/* <div className="h-40 bg-gray-200 mt-4 rounded"></div> */}
      </CardContent>
    </Card>
  )
}

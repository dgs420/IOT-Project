import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { day: 'Mon', entering: 150, leaving: 130 },
  { day: 'Tue', entering: 200, leaving: 190 },
  { day: 'Wed', entering: 175, leaving: 160 },
  { day: 'Thur', entering: 250, leaving: 240 },
  { day: 'Fri', entering: 300, leaving: 280 },
  { day: 'Sat', entering: 275, leaving: 260 },
  { day: 'Sun', entering: 200, leaving: 180 },
];

const TrafficChart = () => {
  return (
    <div className="w-11/12 p-6  bg-slate-100 rounded-sm border border-black flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Traffic Report</h2>
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
    </div>
  );
};

export default TrafficChart;

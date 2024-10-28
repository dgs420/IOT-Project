import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@mui/material';

// const fetchTrafficData = async () => {
//     // Call your API to get the aggregated data
//     return [
//         { range: '0:00-2:00', entering: 20, leaving: 15 },
//         { range: '2:00-4:00', entering: 15, leaving: 10 },
//         { range: '4:00-6:00', entering: 30, leaving: 25 },
//         { range: '6:00-8:00', entering: 40, leaving: 35 },
//         { range: '8:00-10:00', entering: 50, leaving: 45 },
//         { range: '10:00-12:00', entering: 55, leaving: 50 },
//         { range: '12:00-14:00', entering: 60, leaving: 55 },
//         { range: '14:00-16:00', entering: 65, leaving: 60 },
//         { range: '16:00-18:00', entering: 70, leaving: 65 },
//         { range: '18:00-20:00', entering: 75, leaving: 70 },
//         { range: '20:00-22:00', entering: 60, leaving: 55 },
//         { range: '22:00-00:00', entering: 30, leaving: 25 },
//       // More data...
//     ];
//   };

export const HourlyChart = () => {
  const [trafficData, setTrafficData] = useState([]);
  const fetchTrafficData = async () => {
    // Call your API to get the aggregated data
    try {
      const response = await fetch('http://localhost:5000/api/logs/logs-by-hour'); // Adjust URL as needed
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setTrafficData(data);      // Set the fetched data to the logs state
    } catch (error) {
      console.error('Error fetching traffic logs:', error);
    }
  };
  

  useEffect(() => {
    
    fetchTrafficData();
  }, []);

  return (
    <div className="grid py-2">
      {/* Entering Traffic Chart */}
      <Card className="py-2">
        <CardContent>
          <h3 className="text-xl font-bold">Vehicles Entering By Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enter" fill="#82ca9d" name="Vehicles Enter" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leaving Traffic Chart */}
      <Card className="py-2">
        <CardContent>
          <h3 className="text-xl font-bold">Vehicles Leaving By Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="exit" fill="#8884d8" name="Vehicles Exit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

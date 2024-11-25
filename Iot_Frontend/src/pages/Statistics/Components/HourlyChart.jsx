// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardContent } from '@mui/material';
import {getRequest} from "../../../api/index.js";
export const HourlyChart = () => {
  const [trafficData, setTrafficData] = useState([]);

  // Fetch traffic data from the backend API
  const fetchTrafficData = async () => {
    try {
      const data = await getRequest('/logs/logs-by-hour'); // Adjust URL as needed

      if (!data) {
        throw new Error('Failed to fetch logs');
      }

      setTrafficData(data); // Assume setTrafficData is a state updater or similar
    } catch (error) {
      console.error('Error fetching traffic logs:', error);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, []);

  return (
      <div className="grid gap-4 py-4">
        {/* Combined Bar and Line Chart for Entering Traffic */}
        <Card className="py-4">
          <CardContent>
            <h3 className="text-xl font-bold">Vehicles Entering By Hour</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
              {/*  /!* Bar chart for vehicles entering *!/*/}
                <Bar dataKey="enter" fill="#82ca9d" name="Vehicles Enter" />
                {/* Line chart for vehicles entering */}

              </BarChart>
              {/*<LineChart data={trafficData}>*/}
              {/*  <CartesianGrid strokeDasharray="3 3" />*/}
              {/*  <XAxis dataKey="range" />*/}
              {/*  <YAxis />*/}
              {/*  <Tooltip />*/}
              {/*  <Legend />*/}
              {/*  <Line type="monotone" dataKey="enter" stroke="#2ca02c" strokeWidth={2} name="Enter Line" />*/}

              {/*</LineChart>*/}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Combined Bar and Line Chart for Exiting Traffic */}
        <Card className="py-4">
          <CardContent>
            <h3 className="text-xl font-bold">Vehicles Leaving By Hour</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Bar chart for vehicles exiting */}
                <Bar dataKey="exit" fill="#8884d8" name="Vehicles Exit" />
                {/* Line chart for vehicles exiting */}
                <Line type="monotone" dataKey="exit" stroke="#1f77b4" strokeWidth={2} name="Exit Line" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  );
};

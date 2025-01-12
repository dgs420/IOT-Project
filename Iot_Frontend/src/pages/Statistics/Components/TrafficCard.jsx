import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Card, CardContent, TextField} from '@mui/material';
import {format, startOfWeek, isValid, endOfWeek} from 'date-fns';
import {getRequest} from "../../../api/index.js";

export const TrafficCard = () => {
  const [weekData, setWeekData] = useState([]);
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const fetchWeekData = async (start) => {
    if (!start || !isValid(start)) {  // Check for empty or invalid start date
      setWeekData([]);
      return;
    }
    const formattedDate = format(start, 'yyyy-MM-dd');
    try {
      const response = await getRequest(`/logs/traffic-by-week?start_date=${formattedDate}`);
      // if (!response.ok) throw new Error('Failed to fetch logs');
      // console.log(response);
      if (response.code===200) {
        setWeekData(response.info);
      } else {
        console.error(response.message);
      }
      // const data = await response.json();
      // setWeekData(data);
    } catch (error) {
      console.error('Error fetching traffic logs:', error);
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    if (isValid(selectedDate)) {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      setStartDate(weekStart);
      fetchWeekData(weekStart);
    } else {
      setStartDate(null);
    }
   // Fetch data for new start date
  };

  useEffect(() => {
    fetchWeekData(startDate);
  }, []);
  const formattedStartDate = startDate ? format(startDate, 'd MMM') : '';
  const formattedEndDate = startDate ? format(endOfWeek(startDate, { weekStartsOn: 0 }), 'd MMM, yyyy') : '';
  return (
      <Card>
        <CardContent>
          <div className="text-3xl font-bold">Weekly Traffic</div>
          <div className="text-green-500">↑ 2.1% vs last week</div>
          <div className="text-1xl text-gray-500 mb-4">Traffic from {formattedStartDate} - {formattedEndDate}</div>


          <TextField
              type="date"
              onChange={handleDateChange}
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              label="Start Date"
              variant="outlined"
              // fullWidth
              // InputLabelProps={{ shrink: true }}
              sx={{
                marginBottom: 3,
              }}
          />
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weekData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="enter" fill="#82ca9d" name="Vehicles Entering"/>
              <Bar dataKey="exit" fill="#8884d8" name="Vehicles Leaving"/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
};

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@mui/material';
import { getRequest } from "../../../api/index.js";

// Colors for each vehicle type
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const VehiclesPieChart = () => {
    const [data, setData] = useState([
        { vehicles_type: 'Cars', count: 400 },
        { vehicles_type: 'Motorcycles', count: 300 },
        { vehicles_type: 'Buses', count: 100 },
        { vehicles_type: 'Trucks', count: 200 },


    ]); // Set initial state to an empty array

    const getVehiclesTypes = async () => {
        try {
            const response = await getRequest('/home/vehicles-type-count'); // Adjust URL as needed
            if (response.code === 200) {
                setData(response.info); // Ensure this is an array
                console.log(response);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
        }
    };

    useEffect(() => {
        getVehiclesTypes();
    }, []);

    // Add a conditional rendering check for data
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="flex justify-center items-center h-64">
                        <h2 className="text-lg">No data available</h2>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <div className="w-full p-6">
                    <h2 className="text-2xl font-bold mb-4">Vehicle Types</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="vehicle_type"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend className="mt-3" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default VehiclesPieChart;
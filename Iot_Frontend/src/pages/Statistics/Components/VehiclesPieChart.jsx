import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@mui/material';



// Mock data for vehicle types
const data = [
    { name: 'Cars', value: 400 },
    { name: 'Motorcycles', value: 300 },
    { name: 'Buses', value: 100 },
    { name: 'Trucks', value: 200 },
];

// Colors for each vehicle type
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const VehiclesPieChart = () => {
    return (
        <Card>
            <CardContent>
            <div>
                <div className="w-full p-6">
                    <h2 className="text-2xl font-bold mb-4">Vehicle Types</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
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
                            <Legend className="mt-3"/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
            </CardContent>
        </Card>

    )
}

export default VehiclesPieChart

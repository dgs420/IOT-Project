import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@mui/material";
import { fetchData } from "../../../api/fetchData.js";
import { useVehicleTypeStore } from "@/store/useVehicleTypeStore.js";
import { generateColors } from "@/utils/colorGenerator.js";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF66C4",
  "#00B8D9",
  "#FFD700",
  "#FF6666",
  "#66FF66",
  "#9966FF",
  "#FFB266",
  "#33CCCC",
  "#FF99CC",
  "#99FF99",
  "#CCCCFF",
];

const VehiclesPieChart = () => {
  // const [data, setData] = useState([
  //     // { vehicles_type: 'Cars', count: 0 },
  //     // { vehicles_type: 'Motorcycles', count: 0 },
  //     // { vehicles_type: 'Buses', count: 0 },
  //     // { vehicles_type: 'Trucks', count: 0 },

  // ]);
  const [rawData, setRawData] = useState([]);
  const getTypeNameById = useVehicleTypeStore((state) => state.getTypeNameById);
  const data = rawData.map((item) => ({
    ...item,
    name: getTypeNameById(item.vehicle_type_id),
  }));
  const dynamicColors = generateColors(data.length);

  useEffect(() => {
    fetchData("/home/vehicles-type-count", setRawData, null, null);
  }, []);

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
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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

import React,{ useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {fetchData} from "../../../api/fetchData.js";

export default function DailyRevenueChart({ from, to }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!from || !to) return;
        void fetchData(`/payment/transactions-daily?from=${from}&to=${to}`, setData);
        // fetch(`/payment/transactions-daily?from=${from}&to=${to}`)
        //     .then((res) => res.json())
        //     .then((res) => setData(res.info || []));
    }, [from, to]);

    return (
        <div className="p-4 bg-white rounded-xl shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                        formatter={(value, name, props) => {
                            const num = parseFloat(value);
                            return [`$${num.toFixed(2)}`, name];
                        }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

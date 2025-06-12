import React, { useEffect, useState } from "react";
import {fetchData} from "../../../api/fetchData.js";

export default function TransactionSummary() {
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        fetchData("/payment/transactions-summary", setSummary);
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transaction Summary</h2>
            <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Type</th>
                    <th className="p-2">Method</th>
                    <th className="p-2 text-right">Total</th>
                </tr>
                </thead>
                <tbody>
                {summary.map((item, idx) => (
                    <tr key={idx} className="border-t">
                        <td className="p-2 capitalize">{item.transaction_type}</td>
                        <td className="p-2 capitalize">{item.payment_method}</td>
                        <td className="p-2 text-right">₱{parseFloat(item.total).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

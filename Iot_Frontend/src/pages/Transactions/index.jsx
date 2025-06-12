import React from "react";
import TransactionSummary from "./Components/TransactionSummary";
// import DeviceCashFlow from "@/Components/DeviceCashFlow";
import DailyRevenueChart from "./Components/DailyRevenue";
import { useState } from "react";
import TransactionsList from "../../common/components/TransactionsTable.jsx";

export default function TransactionsDashboard() {
    const [from, setFrom] = useState("2025-05-01");
    const [to, setTo] = useState("2025-05-19");

    return (
        <div className='flex flex-col gap-4'>
            <TransactionSummary />
            {/*<DeviceCashFlow />*/}
            {/*<DailyRevenueChart from={from} to={to} />*/}
            <TransactionsList/>
        </div>
    );
}

import React from "react";
import TransactionSummary from "./Components/TransactionSummary";
// import DeviceCashFlow from "@/Components/DeviceCashFlow";
import TransactionsList from "../../common/components/TransactionsTable.jsx";

export default function TransactionsDashboard() {

    return (
        <div className='flex flex-col gap-4'>
            <TransactionSummary />
            {/*<DeviceCashFlow />*/}
            {/*<DailyRevenueChart from={from} to={to} />*/}
            <TransactionsList/>
        </div>
    );
}

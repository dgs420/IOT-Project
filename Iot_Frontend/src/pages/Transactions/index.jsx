import React from "react";
import TransactionSummary from "./Components/TransactionSummary";
// import DeviceCashFlow from "@/Components/DeviceCashFlow";
import TransactionsList from "../../common/components/TransactionsTable.jsx";
import PageContentHeader from "@/common/components/PageContentHeader";

export default function TransactionsDashboard() {

    return (
        <div className='flex flex-col gap-4'>
            <PageContentHeader label="Transactions" description="View all transactions"/>
            {/* <TransactionSummary /> */}
            {/*<DeviceCashFlow />*/}
            {/*<DailyRevenueChart from={from} to={to} />*/}
            <TransactionsList embedId={""} userId={""}/>
        </div>
    );
}

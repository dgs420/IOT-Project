// File: components/transactions/TransactionList.jsx
import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import EmptyState from './EmptyState';

const TransactionList = ({ transactions, loading, error }) => {
   
    if (loading) return <div className="py-8 text-center">Loading transactions...</div>;
    if (error) return <div className="py-8 text-center text-red-500">Error loading transactions</div>;

    if (transactions.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
                <TransactionItem
                    key={transaction.transaction_id}
                    transaction={transaction}
                />
            ))}
           
        </div>
    );
};

export default TransactionList;
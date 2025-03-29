// File: components/transactions/Transactions.jsx
import React, {useState} from 'react';
import TransactionHeader from './components/TransactionHeader';
import TransactionList from './components/TransactionList';
import TransactionFilter from './components/TransactionFilter';
import TransactionPagination from './components/TransactionPagination';
import {useTransactions} from '../../hooks/useTransactions';

const Transactions = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        dateRange: {start: null, end: null}
    });

    const {transactions, loading, error} = useTransactions();

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
        const matchesType = filters.type === 'all' || transaction.transaction_type === filters.type;
        return matchesStatus && matchesType;
    });

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
            <div className="bg-white rounded-lg shadow">
                <TransactionHeader
                    filterOpen={filterOpen}
                    setFilterOpen={setFilterOpen}
                />

                {filterOpen && (
                    <TransactionFilter
                        filters={filters}
                        setFilters={setFilters}
                    />
                )}

                <TransactionList
                    transactions={filteredTransactions}
                    loading={loading}
                    error={error}
                />

                {filteredTransactions.length > 0 && (
                    <TransactionPagination
                        currentPage={1}
                        totalItems={filteredTransactions.length}
                        itemsPerPage={10}
                    />
                )}
            </div>
        </div>
    );
};

export default Transactions;
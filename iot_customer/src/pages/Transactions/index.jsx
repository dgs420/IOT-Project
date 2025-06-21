// File: components/transactions/Transactions.jsx
import React, { useState } from "react";
import TransactionHeader from "./components/TransactionHeader";
import TransactionList from "./components/TransactionList";
import TransactionFilter from "./components/TransactionFilter";
import TransactionPagination from "./components/TransactionPagination";
import { useTransactions } from "../../hooks/useTransactions";
import { TablePagination } from "@mui/material";

const Transactions = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    method: "all",
    dateRange: { start: null, end: null },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { transactions, loading, error } = useTransactions();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      filters.status === "all" || transaction.status === filters.status;
    const matchesType =
      filters.type === "all" || transaction.transaction_type === filters.type;
    const matchesMethod =
      filters.method === "all" || transaction.payment_method === filters.method;
    return matchesStatus && matchesType && matchesMethod;
  });
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <TransactionHeader
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        />

        {filterOpen && (
          <TransactionFilter filters={filters} setFilters={setFilters} />
        )}

        <TransactionList
          transactions={paginatedTransactions}
          loading={loading}
          error={error}
        />

        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[6, 12, 24]}
        />

        {/* {filteredTransactions.length > 0 && (
          <TransactionPagination
            currentPage={currentPage}
            totalItems={filteredTransactions.length}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        )} */}
      </div>
    </>
  );
};

export default Transactions;

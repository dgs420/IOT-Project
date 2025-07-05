import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { ChevronDown, DollarSign, Filter } from "lucide-react";
import TransactionFilter from "./TransactionFilter.jsx";
import TransactionList from "./TransactionList.jsx";
import { fetchData } from "@/api/fetchData.js";

const ClientTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    method: "all",
    dateRange: { start: null, end: null },
  });

  const getFetchParams = () => ({
    ...(filters.method !== "all" && { paymentMethod: filters.method }),
    ...(filters.type !== "all" && { transactionType: filters.type }),
    page: pagination.currentPage,
    limit: pagination.limit,
    ...(filters.dateRange.start && {
      startDate: format(filters.dateRange.start, "yyyy-MM-dd"),
    }),
    ...(filters.dateRange.end && {
      endDate: format(filters.dateRange.start, "yyyy-MM-dd"),
    }),
  });

  // fetch all (or scoped) transactions once
  // useEffect(() => {
  //   const getData = async () => {
  //     setLoading(true);
  //     await fetchData(
  //       `/payment/transactions-paginated`,
  //       setTransactions,
  //       setLoading,
  //       null,
  //       setPagination,
  //     );
  //   };

  //   getData();
  // }, []);

  useEffect(() => {
    void fetchData(
      `/payment/transactions-paginated`,
      setTransactions,
      setLoading,
      null,
      setPagination,
      getFetchParams()
    );
  }, [pagination.currentPage, pagination.limit]);

  // apply client-side filtering whenever transactions or filters change
  useEffect(() => {
    const filtered = transactions.filter((tx) => {
      const matchType =
        filters.type === "all" || tx.transaction_type === filters.type;
      const matchMethod =
        filters.method === "all" || tx.payment_method === filters.method;

      const matchDate =
        (!filters.dateRange.start ||
          new Date(tx.created_at) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end ||
          new Date(tx.created_at) <= new Date(filters.dateRange.end));

      return matchType && matchMethod && matchDate;
    });

    setFilteredTransactions(filtered);
    // setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters, transactions]);

  const handlePageChange = (_, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleLimitChange = (e) => {
    setPagination({
      ...pagination,
      limit: parseInt(e.target.value, 10),
      currentPage: 1,
    });
  };

  const startIdx = (pagination.currentPage - 1) * pagination.limit;
  const paginated = filteredTransactions.slice(
    startIdx,
    startIdx + pagination.limit
  );

  return (
    <Card>
      <CardContent>
        <div className="px-2 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {" "}
                Transaction History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View all your transactions
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4 mr-1.5 text-gray-500" />
                Filter
                <ChevronDown
                  className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-1.5 text-gray-500" />
                        Export
                    </button> */}
            </div>
          </div>
        </div>
        {filterOpen && (
          <TransactionFilter filters={filters} setFilters={setFilters} />
        )}

        <TransactionList
          transactions={filteredTransactions}
          loading={loading}
          error={""}
        />

        {/* <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginated.length > 0 ? (
                paginated.map((tx) => (
                  <TableRow key={tx.transaction_id}>
                    <TableCell>{tx.transaction_id}</TableCell>
                    <TableCell>
                      <DollarSign size={16} style={{ marginRight: 4 }} />
                      {parseFloat(tx.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <TransactionStatusChip
                        status={tx.payment_method}
                        type="method"
                      />
                    </TableCell>
                    <TableCell>
                      <TransactionStatusChip status={tx.status} type="status" />
                    </TableCell>
                    <TableCell>
                      <TransactionStatusChip
                        status={tx.transaction_type}
                        type="type"
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(tx.created_at), "yyyy-MM-dd HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer> */}

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.currentPage - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardContent>
    </Card>
  );
};

export default ClientTransactions;

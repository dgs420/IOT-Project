import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Box,
  Collapse,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { fetchData } from "../../api/fetchData.js";
import { Link } from "react-router-dom";
import { CustomButton } from "./CustomButton.jsx";
import { toast } from "react-toastify";
import { downloadRequest, getRequest } from "../../api/index.js";
import { DollarSign } from "lucide-react";
import { TransactionStatusChip } from "./TransactionStatusChip.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
const TransactionsList = ({ embedId, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [transactionType, seTtransactionType] = useState("all");
  const getFetchParams = () => ({
    ...(embedId && { embedId }),
    ...(userId && { userId }),
    ...(paymentMethod !== "all" && { paymentMethod }),
    ...(transactionType !== "all" && { transactionType }),
    page: pagination.currentPage,
    limit: pagination.limit,
    sortField,
    sortOrder,
    ...(startDate && { startDate: format(startDate, "yyyy-MM-dd") }),
    ...(endDate && { endDate: format(endDate, "yyyy-MM-dd") }),
  });
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleExportExcel = async () => {
    try {
      setExporting(true);

      // Prepare export parameters (without pagination)
      const exportParams = {
        ...(embedId && { embedId }),
        ...(startDate && { startDate: format(startDate, "yyyy-MM-dd") }),
        ...(endDate && { endDate: format(endDate, "yyyy-MM-dd") }),
      };

      // Convert params to query string
      const queryString = new URLSearchParams(exportParams).toString();

      const currentDate = format(new Date(), "yyyy-MM-dd_HH-mm");
      const filename = `transactions_${currentDate}.xlsx`;

      const result = await downloadRequest(
        `/payment/export-transactions?${queryString}`,
        filename
      );

      if (result.code !== 200) {
        throw new Error(result.message || "Export failed");
      }

      toast.success("Export completed:", result.message);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file. Please try again.");
    } finally {
      setExporting(false);
    }
  };
  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 1 });
    void fetchData(
      `/payment/all-transactions-orm`,
      setTransactions,
      setLoading,
      null,
      setPagination,
      getFetchParams()
    );
  };

  useEffect(() => {
    void fetchData(
      `/payment/all-transactions-orm`,
      setTransactions,
      setLoading,
      null,
      setPagination,
      getFetchParams()
    );
  }, [embedId, pagination.currentPage, pagination.limit, sortField, sortOrder]);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) =>
      field === sortField && sortOrder === "ASC" ? "DESC" : "ASC"
    );
  };

  const handlePageChange = (_, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleLimitChange = (e) => {
    setPagination({
      ...pagination,
      limit: parseInt(e.target.value),
      currentPage: 1,
    });
  };

  const renderSortArrow = (field) =>
    sortField === field ? (sortOrder === "ASC" ? " ▲" : " ▼") : "";

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {/* Action buttons & filter toggle */}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Stack direction="row" spacing={1}>
                <CustomButton
                  color="primary"
                  title="Apply Filters"
                  onClick={handleSearch}
                />
                <CustomButton
                  color="secondary"
                  title={exporting ? "Exporting..." : "Export"}
                  onClick={handleExportExcel}
                  disabled={exporting || !transactions.length}
                />
              </Stack>
            </Grid>

            {/* Collapsible Filters */}
            <Grid item xs={12}>
              <Collapse in={showFilters}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                        },
                        actionBar: {
                          actions: ["clear", "today"],
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                        },
                        actionBar: {
                          actions: ["clear", "today"],
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="payment-method-label">Method</InputLabel>
                      <Select
                        labelId="payment-method-label"
                        value={paymentMethod}
                        label="Method"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="rfid_balance">Balance</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="stripe">Stripe</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="transaction-type-label">Type</InputLabel>
                      <Select
                        labelId="transaction-type-label"
                        value={transactionType}
                        label="Type"
                        onChange={(e) => seTtransactionType(e.target.value)}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="top-up">Top up</MenuItem>
                        <MenuItem value="fee">Fee</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </LocalizationProvider>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Transaction ID",
                  "Device",
                  "Amount",
                  "Payment Method",
                  "Status",
                  "Transaction type",
                  "Created at",
                  "User Id",
                ].map((field) => (
                  <TableCell
                    key={field}
                    onClick={() => handleSort(field)}
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    {field.replace(/_/g, " ")}
                    {renderSortArrow(field)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.transaction_id}>
                    <TableCell>{tx.transaction_id}</TableCell>
                    <TableCell>
                      {tx.device_id ? (
                        <Link to={`/device/${tx.embed_id}`}>{tx.embed_id}</Link>
                      ) : (
                        <span className="text-gray-400 italic">No Device</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DollarSign size={16} style={{ marginRight: 4 }} />
                        {parseFloat(tx.amount).toFixed(2)}
                      </Box>
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
                    <TableCell>
                      {tx.user_id ? (
                        <Link to={`/user/${tx.user_id}`}>{tx.user_id}</Link>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.currentPage - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionsList;

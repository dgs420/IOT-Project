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
  CircularProgress,
  Stack,
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

const ActivityList = ({ embedId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getFetchParams = () => ({
    ...(embedId && { embedId }),
    page: pagination.currentPage,
    limit: pagination.limit,
    ...(startDate && { startDate: format(startDate, "yyyy-MM-dd") }),
    ...(endDate && { endDate: format(endDate, "yyyy-MM-dd") }),
  });

  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 1 });
    void fetchData(
      "/logs/all-logs-details",
      setLogs,
      setLoading,
      null,
      setPagination,
      getFetchParams()
    );
  };

  useEffect(() => {
    void fetchData(
      "/logs/all-logs-details",
      setLogs,
      setLoading,
      null,
      setPagination,
      getFetchParams()
    );
  }, [embedId, pagination.currentPage, pagination.limit]);

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

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: { fontSize: 14 },
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
                    sx: { fontSize: 14 },
                  },
                  actionBar: {
                    actions: ["clear", "today"],
                  },
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              display="flex"
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
            >
              <Stack direction="row" spacing={1}>
                <CustomButton
                  color="primary"
                  title="Apply Filters"
                  onClick={handleSearch}
                />
              </Stack>
            </Grid>
          </Grid>
        </LocalizationProvider>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Log ID",
                  "Time",
                  "Action",
                  "Valid",
                  "Details",
                  "Device",
                  "Card ID",
                ].map((field) => (
                  <TableCell key={field} sx={{ fontWeight: "bold" }}>
                    {field}
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
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.log_id}>
                    <TableCell>{log.log_id}</TableCell>
                    <TableCell>
                      {format(new Date(log.time), "yyyy-MM-dd HH:mm")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          log.action.includes("enter")
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          log?.is_valid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {log.is_valid ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          log?.is_valid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {log.details || "None"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.device?.embed_id ? (
                        <Link to={`/device/${log.device.embed_id}`}>
                          {log.device.embed_id}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{log.card_id || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No logs found.
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
export default ActivityList;

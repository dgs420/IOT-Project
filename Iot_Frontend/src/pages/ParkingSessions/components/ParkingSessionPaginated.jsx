import React, { useEffect } from "react"
import { useState } from "react"
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Select, MenuItem, InputLabel, FormControl, Paper } from '@mui/material';

import { ArrowUpDown, AlertCircle } from "lucide-react"
import ParkingSessionTableItem from "./ParkingSessionTableItem.jsx"
import { getRequest } from "@/api/index.js"
import { fetchData } from "@/api/fetchData.js";

const ParkingSessionTablePaginated = () => {
   const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
    });
    const [sortField, setSortField] = useState('entry_time');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    const getFetchParams = () => ({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortField,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentFilter !== 'all' && { paymentStatus: paymentFilter }),
    });

    const fetchSessions = async () => {
        setLoading(true);
        try {
            void fetchData(`/session/all-sessions`, setSessions, setLoading, null, setPagination, getFetchParams());
            // const res = await getRequest('/session/all-sessions',setSessions, getFetchParams());
            // if (res.code === 200) {
            //     setSessions(res.sessions);
            //     setPagination(prev => ({
            //         ...prev,
            //         total: res.pagination.totalRecords,
            //         totalPages: res.pagination.totalPages,
            //     }));
            // }
        } catch (err) {
            console.error('Failed to fetch parking sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchSessions();
    }, [pagination.currentPage, pagination.limit, sortField, sortOrder, searchQuery, statusFilter, paymentFilter]);

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(prev => (field === sortField && sortOrder === 'ASC' ? 'DESC' : 'ASC'));
    };

    const handlePageChange = (_, newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage + 1 }));
    };

    const handleLimitChange = (e) => {
        setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), currentPage: 1 }));
    };

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Box display="flex" gap={2} mb={2} p={2}>
                <TextField
                    size="small"
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FormControl size="small">
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Payment</InputLabel>
                    <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} label="Payment">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="unpaid">Unpaid</MenuItem>
                        <MenuItem value="exempt">Exempt</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            {['session_id','user_id', 'vehicle_plate', 'entry_time', 'exit_time','duration', 'status', 'payment_status', 'fee'].map(field => (
                                <TableCell key={field} onClick={() => handleSort(field)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    {field.replace(/_/g, ' ')}{sortField === field ? (sortOrder === 'ASC' ? ' ▲' : ' ▼') : ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map(session => <ParkingSessionTableItem key={session.session_id} session={session} />)}
                    </TableBody>
                </Table>
            )}

            <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.currentPage - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                onRowsPerPageChange={handleLimitChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
};
export default ParkingSessionTablePaginated

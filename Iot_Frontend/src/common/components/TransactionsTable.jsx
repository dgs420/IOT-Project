import React, {useEffect, useState} from 'react';
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
    Stack
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import {fetchData} from "../../api/fetchData.js";
import {Link} from "react-router-dom";
import {CustomButton} from "./CustomButton.jsx";
import {toast} from "react-toastify";
import {downloadRequest, getRequest} from "../../api/index.js";

const TransactionsList = ({embedId}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const getFetchParams = () => ({
        ...(embedId && { embedId }),
        page: pagination.currentPage,
        limit: pagination.limit,
        sortField,
        sortOrder,
        ...(startDate && { startDate: format(startDate, 'yyyy-MM-dd') }),
        ...(endDate && { endDate: format(endDate, 'yyyy-MM-dd') }),
    });
    const [exporting, setExporting] = useState(false);

    const handleExportExcel = async () => {
        try {
            setExporting(true);

            // Prepare export parameters (without pagination)
            const exportParams = {
                ...(embedId && { embedId }),
                ...(startDate && { startDate: format(startDate, 'yyyy-MM-dd') }),
                ...(endDate && { endDate: format(endDate, 'yyyy-MM-dd') }),
            };

            // Convert params to query string
            const queryString = new URLSearchParams(exportParams).toString();

            const currentDate = format(new Date(), 'yyyy-MM-dd_HH-mm');
            const filename = `transactions_${currentDate}.xlsx`;

            const result = await downloadRequest(`/payment/export-transactions?${queryString}`, filename);

            if (result.code !== 200) {
                throw new Error(result.message || 'Export failed');
            }

            toast.success('Export completed:', result.message);

        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export Excel file. Please try again.');
        } finally {
            setExporting(false);
        }
    };
    const handleSearch = () => {
        setPagination({...pagination, currentPage: 1});
        void fetchData(`/payment/all-transactions-orm`, setTransactions, setLoading, null, setPagination, getFetchParams());
    };

    useEffect(() => {
        void fetchData(`/payment/all-transactions-orm`, setTransactions, setLoading, null, setPagination, getFetchParams());
    }, [embedId, pagination.currentPage, pagination.limit, sortField, sortOrder]);


    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(prev => (field === sortField && sortOrder === 'ASC' ? 'DESC' : 'ASC'));
    };

    const handlePageChange = (_, newPage) => {
        setPagination(prev => ({...prev, currentPage: newPage + 1}));
    };

    const handleLimitChange = (e) => {
        setPagination({...pagination, limit: parseInt(e.target.value), currentPage: 1});
    };

    const renderSortArrow = (field) =>
        sortField === field ? (sortOrder === 'ASC' ? ' ▲' : ' ▼') : '';

    return (
        <Card sx={{mb: 4}}>
            <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }} >
                        <Grid item xs={12} sm={6} md={3}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        sx: {fontSize: 14},
                                    },
                                    actionBar: {
                                        actions: ['clear', 'today'],
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
                                        size: 'small',
                                        sx: {fontSize: 14},
                                    },
                                    actionBar: {
                                        actions: ['clear', 'today'],
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                            <Stack direction="row" spacing={1}>
                                <CustomButton
                                    color="primary"
                                    title="Apply Filters"
                                    onClick={handleSearch}
                                />
                                <CustomButton
                                    color="secondary"
                                    title={exporting ? 'Exporting...' : 'Export'}
                                    onClick={handleExportExcel}
                                    disabled={exporting || !transactions.length}
                                    // icon={exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Transaction ID", "Device", "Amount", "Payment Method", "Status", "Transaction type", "Created at","User Id"].map(field => (
                                    <TableCell
                                        key={field}
                                        onClick={() => handleSort(field)}
                                        sx={{cursor: 'pointer', fontWeight: 'bold'}}
                                    >
                                        {field.replace(/_/g, ' ')}{renderSortArrow(field)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
                            ) : transactions.length > 0 ? (
                                transactions.map(tx => (
                                    <TableRow key={tx.transaction_id}>
                                        <TableCell>{tx.transaction_id}</TableCell>
                                        <TableCell>
                                            <Link to={'/device/' + tx.embed_id}>{tx.embed_id}</Link>
                                        </TableCell>
                                        <TableCell>${parseFloat(tx.amount).toFixed(2)}</TableCell>
                                        <TableCell>{tx.payment_method}</TableCell>
                                        <TableCell>{tx.status}</TableCell>
                                        <TableCell>{tx.transaction_type}</TableCell>
                                        <TableCell>{format(new Date(tx.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                                        <TableCell>{tx.user_id || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={7} align="center">No data</TableCell></TableRow>

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

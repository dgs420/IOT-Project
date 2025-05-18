import React from "react"
import {
    Paper,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button, Grid2,
} from "@mui/material"
import { Search, Filter, Download, RefreshCw } from "lucide-react"

const ParkingSessionFilters = ({
                                   searchQuery,
                                   setSearchQuery,
                                   statusFilter,
                                   setStatusFilter,
                                   paymentFilter,
                                   setPaymentFilter,
                                   onRefresh,
                                   onExport,
                                   loading,
                                   hasData,
                               }) => {
    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Grid2 container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid2 item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Search by vehicle number or session ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        size="small"
                        sx={{ minWidth: 400 }}
                    />
                </Grid2>
                {/* Left side: Filters + Buttons */}
                <Grid2
                    container
                    item
                    xs={12}
                    md={8}
                    spacing={2}
                    alignItems="center"
                >
                    <Grid2 item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Filter size={18} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>

                    <Grid2 item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Payment</InputLabel>
                            <Select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                label="Payment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Filter size={18} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">All Payments</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="unpaid">Unpaid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>

                    <Grid2 item md="auto">
                        <Button
                            variant="outlined"
                            startIcon={<Download size={18} />}
                            onClick={onExport}
                            disabled={loading || !hasData}
                        >
                            Export
                        </Button>
                    </Grid2>

                    <Grid2 item md="auto">
                        <Button
                            variant="outlined"
                            startIcon={<RefreshCw size={18} />}
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                    </Grid2>
                </Grid2>

                {/* Right side: Search */}

            </Grid2>
        </Paper>

    )
}

export default ParkingSessionFilters

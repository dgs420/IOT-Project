import React from "react"
import { useState } from "react"
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Typography,
    Paper,
    useTheme,
} from "@mui/material"
import { ArrowUpDown, AlertCircle } from "lucide-react"
import ParkingSessionTableItem from "./ParkingSessionTableItem.jsx"

const ParkingSessionTable = ({ sessions, loading, sortConfig, onSort }) => {
    const theme = useTheme()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10))
        setPage(0)
    }

    // Render sort indicator
    const renderSortIndicator = (field) => {
        if (sortConfig.field !== field) return null

        return (
            <Box component="span" sx={{ ml: 0.5, display: "inline-flex", alignItems: "center" }}>
                <ArrowUpDown size={16} />
            </Box>
        )
    }

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="parking sessions table">
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => onSort("session_id")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>Session ID {renderSortIndicator("session_id")}</Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>User Id</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
                            <TableCell onClick={() => onSort("entry_time")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>Entry Time {renderSortIndicator("entry_time")}</Box>
                            </TableCell>
                            <TableCell onClick={() => onSort("exit_time")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>Exit Time {renderSortIndicator("exit_time")}</Box>
                            </TableCell>
                            <TableCell onClick={() => onSort("duration")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>Duration {renderSortIndicator("duration")}</Box>
                            </TableCell>
                            <TableCell sx={{fontWeight: "bold" }}>Status</TableCell>
                            <TableCell sx={{fontWeight: "bold" }}>Payment</TableCell>
                            <TableCell onClick={() => onSort("fee")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>Fee {renderSortIndicator("fee")}</Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && sessions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Loading parking sessions...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : sessions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                        <AlertCircle size={24} color={theme.palette.text.secondary} />
                                        <Typography color="text.secondary">No parking sessions found</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sessions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((session) => <ParkingSessionTableItem key={session.session_id} session={session} />)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sessions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default ParkingSessionTable

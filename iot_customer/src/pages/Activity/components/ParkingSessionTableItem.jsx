import { TableRow, TableCell, Box } from "@mui/material"
import { Car, DollarSign } from "lucide-react"
import StatusChip from "./StatusChip"
import { formatDate, calculateDuration, formatDuration } from "../../../utils/formatters"

const ParkingSessionTableItem = ({ session }) => {
    const duration = calculateDuration(session)

    return (
        <TableRow hover>
            <TableCell>#{session.session_id}</TableCell>
            <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Car size={16} style={{ marginRight: 8 }} />
                    {session.Vehicle.vehicle_number}
                </Box>
            </TableCell>
            <TableCell>{formatDate(session.entry_time)}</TableCell>
            <TableCell>{formatDate(session.exit_time)}</TableCell>
            <TableCell>{formatDuration(duration)}</TableCell>
            <TableCell>
                <StatusChip status={session.status} type="status" />
            </TableCell>
            <TableCell>
                <StatusChip status={session.payment_status} type="payment" />
            </TableCell>
            <TableCell>
                {session.fee ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DollarSign size={16} style={{ marginRight: 4 }} />
                        {Number.parseFloat(session.fee).toFixed(2)}
                    </Box>
                ) : (
                    "—"
                )}
            </TableCell>
        </TableRow>
    )
}

export default ParkingSessionTableItem

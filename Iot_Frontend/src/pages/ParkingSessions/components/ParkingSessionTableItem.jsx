import React from "react";
import { Box, TableCell, TableRow } from "@mui/material";
import { DollarSign } from "lucide-react";
import StatusChip from "./StatusChip.jsx";
import {
  calculateDuration,
  formatDate,
  formatDuration,
} from "../../../utils/formatters.js";
import { Link } from "react-router-dom";
import { getVehicleIcon } from "../../../utils/helpers.jsx";
import { useVehicleTypeStore } from "../../../store/useVehicleTypeStore.js";

const ParkingSessionTableItem = ({ session }) => {
  const duration = calculateDuration(session);
  const getTypeNameById = useVehicleTypeStore((state) => state.getTypeNameById);
  return (
    <TableRow hover>
      <TableCell>#{session.session_id}</TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {session.Vehicle?.user_id ? (
            <Link to={`/user/${session.Vehicle.user_id}`}>
              {session.Vehicle.user_id}
            </Link>
          ) : (
            <span>Unknown User</span> // Or fallback UI
          )}
        </Box>
      </TableCell>
      <TableCell>
        {session.Vehicle ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-8">
                {getVehicleIcon(session.Vehicle.vehicle_type_id)}
              </span>
              <span className="font-medium text-lg">
                {session.Vehicle.vehicle_number ?? "Unknown Number"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({getTypeNameById(session.Vehicle.vehicle_type_id)})
            </span>
          </div>
        ) : (
          <div className="text-gray-400 italic">Vehicle data missing</div>
        )}
      </TableCell>

      <TableCell>{formatDate(session.entry_time)}</TableCell>
      <TableCell>
        {session.exit_time ? formatDate(session.exit_time) : "—"}
      </TableCell>
      <TableCell>{formatDuration(duration)}</TableCell>
      <TableCell>
        <StatusChip status={session.status} type="status" />
      </TableCell>
      <TableCell>
        <StatusChip status={session.payment_status} type="payment" />
      </TableCell>
      <TableCell>
        {session.fee > 0 ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DollarSign size={16} style={{ marginRight: 4 }} />
            {Number.parseFloat(session.fee).toFixed(2)}
          </Box>
        ) : (
          <span className="text-gray-400 italic">Not Available</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ParkingSessionTableItem;

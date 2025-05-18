import React from "react";
import { useState } from "react"
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    LinearProgress,
    IconButton,
    Tooltip,
    Chip,
    useTheme,
} from "@mui/material"
import { Edit, Trash2} from "lucide-react"
import { getVehicleIcon } from "../../../utils/helpers"

const ParkingSpaceItem = ({ space, vehicleType, onEdit, onDelete }) => {
    const theme = useTheme()
    const [isHovered, setIsHovered] = useState(false)

    // Calculate occupancy percentage
    const occupancyPercentage = Math.round((space.occupied_spaces / space.total_spaces) * 100) || 0

    // Get color based on occupancy
    const getOccupancyColor = (percentage) => {
        if (percentage < 50) return "success"
        if (percentage < 80) return "warning"
        return "error"
    }

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                ...(isHovered && {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                }),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: theme.palette.primary.light,
                }}
            >
                {getVehicleIcon(vehicleType.vehicle_type_id)}
                <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {vehicleType ? vehicleType.vehicle_type_name : `Vehicle Type ${space.vehicle_type_id}`}
                </Typography>
                <Chip label={`ID: ${space.space_id}`} size="small" variant="outlined" sx={{ bgcolor: "white" }} />
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Occupancy
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {space.occupied_spaces} / {space.total_spaces}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={occupancyPercentage}
                        color={getOccupancyColor(occupancyPercentage)}
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Available Spaces:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="success.main">
                        {space.available_spaces}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Spaces:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {space.total_spaces}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end", p: 1, borderTop: 1, borderColor: "divider" }}>
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(space)}>
                        <Edit size={18} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => onDelete(space)} disabled={space.occupied_spaces > 0}>
                        <Trash2 size={18} />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

export default ParkingSpaceItem

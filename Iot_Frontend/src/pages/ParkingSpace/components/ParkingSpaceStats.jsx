"use client"

import { Grid, Card, CardContent, Box, Typography, useTheme } from "@mui/material"
import { Car, CircleDashed, CircleCheck, CircleX } from "lucide-react"

const ParkingSpaceStats = ({ spaces }) => {
    const theme = useTheme()

    // Calculate statistics
    const totalSpaces = spaces.reduce((sum, space) => sum + space.total_spaces, 0)
    const occupiedSpaces = spaces.reduce((sum, space) => sum + space.occupied_spaces, 0)
    const availableSpaces = spaces.reduce((sum, space) => sum + space.available_spaces, 0)
    const occupancyRate = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0

    // Stats cards data
    const stats = [
        {
            title: "Total Spaces",
            value: totalSpaces,
            icon: <Car size={24} />,
            color: "primary",
        },
        {
            title: "Available Spaces",
            value: availableSpaces,
            icon: <CircleCheck size={24} />,
            color: "success",
        },
        {
            title: "Occupied Spaces",
            value: occupiedSpaces,
            icon: <CircleX size={24} />,
            color: "error",
        },
        {
            title: "Occupancy Rate",
            value: `${occupancyRate}%`,
            icon: <CircleDashed size={24} />,
            color: "warning",
        },
    ]

    return (
        <Grid container spacing={3} sx={{ mb: 4, mt: 1}}>
            {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: theme.palette[stat.color].light,
                                        color: theme.palette[stat.color].main,
                                        mr: 2,
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography variant="h6" color="text.secondary">
                                    {stat.title}
                                </Typography>
                            </Box>
                            <Typography variant="h4">{stat.value}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default ParkingSpaceStats

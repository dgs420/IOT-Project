// File: src/components/CustomerDashboard/ParkingMap.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

// This is a placeholder for the actual map component
// In a real application, you might use Google Maps, Leaflet, or similar
export default function ParkingMap({ parkingLots }) {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Available Parking Lots</Typography>

            {/* Placeholder for an actual map */}
            <Paper
                sx={{
                    height: 300,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#e0e0e0'
                }}
            >
                <Typography color="text.secondary">Interactive Map Would Be Here</Typography>
            </Paper>

            <Grid container spacing={2}>
                {parkingLots.map(lot => (
                    <Grid item xs={12} sm={6} md={4} key={lot.id}>
                        <ParkingLotCard lot={lot} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function ParkingLotCard({ lot }) {
    const availabilityPercentage = (lot.availableSpots / lot.totalSpots) * 100;

    let statusColor = 'error.main';
    if (availabilityPercentage > 50) {
        statusColor = 'success.main';
    } else if (availabilityPercentage > 20) {
        statusColor = 'warning.main';
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" noWrap>{lot.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{lot.location}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                    <Typography component="span" fontWeight="bold" color={statusColor}>
                        {lot.availableSpots}
                    </Typography> / {lot.totalSpots} spots
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: statusColor,
                        fontWeight: 'bold'
                    }}
                >
                    {availabilityPercentage.toFixed(0)}% free
                </Typography>
            </Box>
        </Paper>
    );
}
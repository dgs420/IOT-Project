import React from 'react';
import { Box, Typography, Grid, Paper, LinearProgress } from '@mui/material';
import ParkingLotCard from "./ParkingLotCard.jsx";

const ParkingMap = ({ parkingLots = [] }) => {
    return (
        <Box sx={{
                p: 3,
                maxHeight: '60vh',      
                overflowY: 'auto',     
            }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Parking Availability
            </Typography>

            <Grid container spacing={3}>
                {parkingLots.map(lot => (
                    <Grid item xs={12} sm={6} md={4} key={lot.space_id}>
                        <ParkingLotCard lot={lot} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ParkingMap
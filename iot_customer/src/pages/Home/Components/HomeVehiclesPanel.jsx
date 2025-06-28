import React, {useEffect} from 'react';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import {ChevronRight, CreditCard} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {getRequest} from "../../../api/index.js";
import HomeVehiclesItem from "./HomeVehiclesItem.jsx";
import {CustomButton} from "../../../Common/Components/CustomButton.jsx";

export default function HomeVehiclesPanel({ onRequestNewCard}) {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = React.useState([]);
    useEffect( () => {
            const getUserVehicles = async () => {
                try {
                    const response = await getRequest('/vehicle/recent-vehicles');
                    if (response.code === 200) {
                        setVehicles(response.info);
                    } else
                        console.error(response.message);
                } catch (error) {
                    console.error('Error fetching traffic logs:', error);
                }
            }
            getUserVehicles();

        },
        [])
    return (
        <Paper sx={{ p: 3, flex: 1, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>Your Vehicles</Typography>
                </Box>
                <CustomButton
                    variant='success'
                    onClick={onRequestNewCard}
                    icon = {CreditCard}
                >
                    REGISTER NEW VEHICLE
                </CustomButton>

            </Box>

            <Box sx={{ maxHeight: '200px', overflowY: 'auto',display: 'flex', flexDirection: 'column', gap: 2 }}>
                {vehicles.map((vehicle) => (
                    <HomeVehiclesItem key={vehicle.vehicle_id} vehicle={vehicle} />
                ))}
            </Box>

            <Button
                fullWidth
                variant="outlined"
                endIcon={<ChevronRight />}
                sx={{ mt: 2, borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#115293', color: '#115293' } }}
                onClick={() => navigate('/your-vehicles')}
            >
                View All Registered Vehicles
            </Button>
        </Paper>
    );
}




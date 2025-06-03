import React, {useEffect} from 'react';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import {ChevronRight, CreditCard} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {getRequest} from "../../../api/index.js";
import HomeCardsItem from "./HomeCardsItem.jsx";
import {CustomButton} from "../../../Common/Components/CustomButton.jsx";

export default function HomeCardsPanel({ onRequestNewCard}) {
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
                    {/*<CreditCard  className="h-4 w-4 mr-2" />*/}
                    REGISTER NEW VEHICLE
                </CustomButton>

            </Box>

            <Box sx={{ maxHeight: '200px', overflowY: 'auto',display: 'flex', flexDirection: 'column', gap: 2 }}>
                {vehicles.map((vehicle) => (
                    <HomeCardsItem key={vehicle.vehicle_id} card={vehicle} />
                ))}
            </Box>

            <Button
                fullWidth
                variant="outlined" // Changed to outlined for distinction
                endIcon={<ChevronRight />}
                sx={{ mt: 2, borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#115293', color: '#115293' } }}
                onClick={() => navigate('/your-cards')}
            >
                View All Registered Vehicles
            </Button>
        </Paper>
    );
}




// components/RfidCardItem.jsx
import React from 'react';
import { Card, CardContent, Button, Chip, Divider, Typography, Box } from "@mui/material";
import { CreditCard, LocalTaxi, DirectionsCar, TwoWheeler } from '@mui/icons-material';

// eslint-disable-next-line react/prop-types
const CardItem = ({ card, onDelete }) => {

    const getVehicleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'car':
                return <DirectionsCar />;
            case 'bike':
                return <TwoWheeler />;
            default:
                return <LocalTaxi />;
        }
    };

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
            }}
        >
            <CardContent sx={{ p: 0 }}>
                {/* Card Header */}
                <Box sx={{
                    p: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <CreditCard />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {card.card_number}
                    </Typography>
                </Box>

                {/* Status Indicator */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 1,
                    bgcolor: card.status === 'exited' ? 'error.50' : 'success.50'
                }}>
                    <Chip
                        label={card.status.toUpperCase()}
                        color={card.status === 'exited' ? 'error' : 'success'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Divider />

                {/* Card Details */}
                <Box sx={{ p: 2 }}>
                    {/* Vehicle Details */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 1,
                        bgcolor: 'grey.100',
                        borderRadius: 1
                    }}>
                        {getVehicleIcon(card.vehicle_type)}
                        <Box sx={{ ml: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Vehicle Details
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {card.vehicle_number ? `${card.vehicle_number} (${card.vehicle_type || 'Unknown'})` : 'No vehicle linked'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Action Button */}
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => onDelete(card.card_id)}
                        sx={{
                            mt: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Delete Card
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CardItem;
// File: src/components/CustomerDashboard/UserCardsPanel.jsx
import React from 'react';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import {ChevronRight, CreditCard} from '@mui/icons-material';

export default function UserCardsPanel({ cards , onRequestNewCard}) {
    return (
        <Paper sx={{ p: 3, flex: 1, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>Your Cards</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your parking cards
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#ff4081', // Custom color
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#e91e63', // Darker shade on hover
                        },
                    }}
                    startIcon={<CreditCard />}
                    onClick={onRequestNewCard}
                >
                    Request New Card
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cards.map((card) => (
                    <CardItem key={card.id} card={card} />
                ))}
            </Box>

            <Button
                fullWidth
                variant="outlined" // Changed to outlined for distinction
                endIcon={<ChevronRight />}
                sx={{ mt: 2, borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#115293', color: '#115293' } }}
            >
                View All Cards
            </Button>
        </Paper>
    );
}

function CardItem({ card }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': { boxShadow: 2 },
            }}
        >
            <Box>
                <Typography variant="body1" fontWeight="medium">{card.id}</Typography>
                <Typography variant="body2" color="text.secondary">{card.vehicle}</Typography>
            </Box>
            <Chip
                label={card.type}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'capitalize' }}
            />
        </Box>
    );
}
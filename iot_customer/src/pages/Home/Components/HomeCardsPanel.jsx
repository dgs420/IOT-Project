import React, {useEffect} from 'react';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import {ChevronRight, CreditCard} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {getRequest} from "../../../api/index.jsx";
import HomeCardsItem from "./HomeCardsItem.jsx";

export default function HomeCardsPanel({ onRequestNewCard}) {
    const navigate = useNavigate();

    const [cards, setCards] = React.useState([]);
    useEffect( () => {
            const getUserCards = async () => {
                try {
                    const response = await getRequest('/card/recent-cards');
                    console.log(response);
                    if (response.code === 200) {
                        setCards(response.info);
                    } else
                        console.error(response.message);
                } catch (error) {
                    console.error('Error fetching traffic logs:', error);
                }
            }
            getUserCards();

        },
        [])
    return (
        <Paper sx={{ p: 3, flex: 1, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>Your Cards</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your parking cards
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

            <Box sx={{ maxHeight: '200px', overflowY: 'auto',display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cards.map((card) => (
                    <HomeCardsItem key={card.id} card={card} />
                ))}
            </Box>

            <Button
                fullWidth
                variant="outlined" // Changed to outlined for distinction
                endIcon={<ChevronRight />}
                sx={{ mt: 2, borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#115293', color: '#115293' } }}
                onClick={() => navigate('/your-cards')}
            >
                View All Cards
            </Button>
        </Paper>
    );
}




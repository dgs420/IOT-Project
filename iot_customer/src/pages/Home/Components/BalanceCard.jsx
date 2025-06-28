// File: src/components/CustomerDashboard/BalanceCard.jsx
import React, {useEffect, useState} from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { CreditCard, Add } from '@mui/icons-material';
import {getRequest} from "../../../api/index.js";

export default function BalanceCard({ balance, onTopUp, onRequestNewCard }) {
    // const [balance, setBalance] = useState(0);
    // useEffect(  () => {
    //     const getUserBalance = async () => {
    //         try {
    //             const response = await getRequest('/payment/balance');
    //             console.log(response);
    //             if (response.code === 200) {
    //                 setBalance(response.info.balance);
    //             } else
    //                 console.error(response.message);
    //         } catch (error) {
    //             console.error('Error fetching traffic logs:', error);
    //         }
    //     }
    //     getUserBalance();
    //
    // }, []);
    return (
        <Paper sx={{
            p: 3,
            background: 'linear-gradient(to right, #1976d2, #42a5f5)',
            color: 'white',
            flex: 1,
            boxShadow: 3
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Current Balance</Typography>
                <CreditCard />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                Your available parking credit
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
                ${balance}
            </Typography>
            <Box sx={{ display: 'flex', justifyItems:'', gap: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'dark-green',
                        },
                    }}
                    startIcon={<Add />}
                    onClick={onTopUp}
                >
                    Top Up Balance
                </Button>
            </Box>
        </Paper>
    );
}
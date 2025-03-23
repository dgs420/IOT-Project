import React, {useEffect, useState} from 'react';
import {Box, Container, Paper, Tab, Tabs} from '@mui/material';
import BalanceCard from './BalanceCard';
import HomeCardsPanel from './HomeCardsPanel';
import ParkingMap from './ParkingMap';
import HomeTransactionPanel from './HomeTransactionPanel';
import TopUpDialogWrapper from './dialogs/TopUpDialogWrapper'; // Import the wrapper instead
import NewCardDialog from './dialogs/NewCardDialog';
import {loadStripe} from "@stripe/stripe-js";
// import process from "process";

// Mock data would typically come from an API or context
import {parkingLots, recentTransactions, userCards} from './MockData';
import {getRequest} from "../../../api/index.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CustomerDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
    const [newCardDialogOpen, setNewCardDialogOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [balance, setBalance] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCloseTopUpDialog = () => {
        setTopUpDialogOpen(false);
        // Reset clientSecret when dialog is closed
        setClientSecret("");
    };
    const getUserBalance = async () => {
        try {
            const response = await getRequest('/payment/balance');
            console.log(response);
            if (response.code === 200) {
                setBalance(response.info.balance);
            } else
                console.error(response.message);
        } catch (error) {
            console.error('Error fetching traffic logs:', error);
        }
    }
    useEffect(() => {
        getUserBalance();
    },[]);
    return (
        <Box sx={{bgcolor: '#f5f5f5', minHeight: '100vh'}}>
            <div className='px-4 py-4' >
                {/* Balance and Cards Section */}
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 3, mb: 4}}>
                    <BalanceCard
                        balance={balance}
                        onTopUp={() => setTopUpDialogOpen(true)}
                    />
                    <HomeCardsPanel
                        onRequestNewCard={() => setNewCardDialogOpen(true)}
                    />
                </Box>

                {/* Tabs Section */}
                <Paper sx={{mb: 4, boxShadow: 3}}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{borderBottom: 1, borderColor: 'divider'}}
                    >
                        <Tab label="Parking Map"/>
                        <Tab label="Recent Transactions"/>
                    </Tabs>

                    {/* Tab Panels */}
                    {tabValue === 0 && <ParkingMap parkingLots={parkingLots}/>}
                    {tabValue === 1 && <HomeTransactionPanel transactions={recentTransactions}/>}
                </Paper>
            </div>

            {/* Dialogs */}
            <TopUpDialogWrapper
                open={topUpDialogOpen}
                onClose={handleCloseTopUpDialog}
                clientSecret={clientSecret}
                setClientSecret={setClientSecret}
                stripePromise={stripePromise}
                currentBalance={balance}
            />

            <NewCardDialog
                open={newCardDialogOpen}
                onClose={() => setNewCardDialogOpen(false)}
            />
        </Box>
    );
}
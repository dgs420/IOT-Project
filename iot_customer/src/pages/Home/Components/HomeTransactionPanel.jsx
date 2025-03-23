// File: src/components/CustomerDashboard/TransactionsPanel.jsx
import React, {useEffect} from 'react';
import {
    Box, Card, CardHeader, CardContent, CardActions,
    Button, List, Typography, Avatar
} from '@mui/material';
import {
    AccountBalanceWallet, AccessTime, CalendarToday
} from '@mui/icons-material';
import HomeTransactionItem from './HomeTransactionItem';
import {useNavigate} from "react-router-dom";
import {getRequest} from "../../../api/index.jsx";

export default function HomeTransactionPanel() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = React.useState([]);
    useEffect(() => {
        const getRecentTransactions = async () => {
            try {
                const response = await getRequest('/payment/recent-transactions');
                console.log(response);
                if (response.code === 200) {
                    setTransactions(response.info);
                } else {

                    console.error(response.message);
                }
            } catch (error) {
                console.error('Error fetching traffic logs:', error);
            }
        }
        getRecentTransactions();
    }, []);
    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardHeader
                    title="Recent Transactions"
                    subheader="Your parking and payment history"
                />
                <CardContent>
                    <List sx={{ p: 0 }}>
                        {transactions.map((transaction) => (
                            <HomeTransactionItem
                                key={transaction.transaction_id}
                                transaction={transaction}
                            />
                        ))}
                    </List>
                </CardContent>
                <CardActions
                    onClick={() => navigate('/transactions')}
                >
                    <Button fullWidth variant="outlined">View All Transactions</Button>
                </CardActions>
            </Card>
        </Box>
    );
}
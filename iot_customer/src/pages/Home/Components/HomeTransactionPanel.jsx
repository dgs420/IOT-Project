// File: src/components/CustomerDashboard/TransactionsPanel.jsx
import React, {useEffect,useState} from 'react';
import {
    Box, Card, CardHeader, CardContent, CardActions,
    Button, List, Typography, Avatar
} from '@mui/material';
import {
    AccountBalanceWallet, AccessTime, CalendarToday
} from '@mui/icons-material';
import HomeTransactionItem from './HomeTransactionItem';
import {useNavigate} from "react-router-dom";
import {getRequest} from "../../../api/index.js";
import {fetchData} from "../../../api/fetchData.js";

export default function HomeTransactionPanel({ transactions = [] }) {
    const navigate = useNavigate();
    // const [transactions, setTransactions] = useState([]);
    // useEffect(() => {
    //     void fetchData('/payment/recent-transactions', setTransactions, null,null);
    //
    // }, []);
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
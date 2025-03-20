// File: src/components/CustomerDashboard/TransactionsPanel.jsx
import React from 'react';
import {
    Box, Card, CardHeader, CardContent, CardActions,
    Button, List, Typography, Avatar
} from '@mui/material';
import {
    AccountBalanceWallet, AccessTime, CalendarToday
} from '@mui/icons-material';
import TransactionItem from './TransactionItem';

export default function TransactionPanel({ transactions }) {
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
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </List>
                </CardContent>
                <CardActions>
                    <Button fullWidth variant="outlined">View All Transactions</Button>
                </CardActions>
            </Card>
        </Box>
    );
}
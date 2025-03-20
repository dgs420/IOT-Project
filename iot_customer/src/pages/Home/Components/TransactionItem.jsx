// File: src/components/CustomerDashboard/TransactionItem.jsx
import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box } from '@mui/material';
import { AccountBalanceWallet, AccessTime, CalendarToday } from '@mui/icons-material';

export default function TransactionItem({ transaction }) {
    return (
        <ListItem
            sx={{
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        >
            <ListItemAvatar>
                <Avatar
                    sx={{
                        bgcolor: transaction.amount > 0 ? 'success.light' : 'primary.light',
                        color: transaction.amount > 0 ? 'success.dark' : 'primary.dark',
                    }}
                >
                    {transaction.amount > 0 ? <AccountBalanceWallet /> : <AccessTime />}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={transaction.type}
                secondary={
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 12, mr: 0.5 }} />
                            {transaction.date} • {transaction.time}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {transaction.location}
                        </Typography>
                    </>
                }
            />
            <Typography
                variant="body1"
                fontWeight="medium"
                color={transaction.amount > 0 ? 'success.main' : 'primary.main'}
            >
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
            </Typography>
        </ListItem>
    );
}
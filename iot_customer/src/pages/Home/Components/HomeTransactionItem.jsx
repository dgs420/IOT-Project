
import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box } from '@mui/material';
import { AccountBalanceWallet, AccessTime, CalendarToday } from '@mui/icons-material';
import {Calendar} from "lucide-react";
import {formatDate} from "../../../utils/formatters.js";
import {getTransactionIcon, getTransactionTypeLabel} from "../../../utils/transactionHelpers.jsx";

export default function HomeTransactionItem({ transaction }) {
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
                        bgcolor: transaction.transaction_type === 'fee' ? 'success.light' : 'primary.light',
                        color: transaction.transaction_type === 'fee' ? 'success.dark' : 'primary.dark',
                    }}
                >
                    {/*{transaction.type === 'fee' ? <AccountBalanceWallet/> : <AccessTime/>}*/}
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getTransactionIcon(transaction.transaction_type, transaction.status)}
                    </div>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={getTransactionTypeLabel(transaction.transaction_type)}
                secondary={
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/*<CalendarToday sx={{ fontSize: 12, mr: 0.5 }} />*/}
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(transaction.createdAt)}
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
                color={transaction.transaction_type === 'fee' ? 'success.main' : 'primary.main'}
            >
                {transaction.transaction_type === 'fee'? ' + ' : ' - '}{transaction.amount}
            </Typography>
        </ListItem>
    );
}
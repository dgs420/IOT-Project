import React from 'react';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Update as UpdateIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';

export const getNotificationIcon = (type) => {
    switch (type) {
        case 'success':
            return <CheckCircleIcon sx={{ color: 'success.main' }} />;
        case 'fail':
            return <CancelIcon sx={{ color: 'error.main' }} />;
        case 'warning':
            return <WarningIcon sx={{ color: 'warning.main' }} />;
        case 'info':
        default:
            return <UpdateIcon sx={{ color: 'info.main' }} />;
    }
};
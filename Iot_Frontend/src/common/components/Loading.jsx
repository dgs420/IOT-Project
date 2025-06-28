import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading = ({ fullScreen = false }) => {
    return (
        <Box
            className={fullScreen ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50" : ""}
        >
            <CircularProgress />
        </Box>
    );
};

export default Loading;
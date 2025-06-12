import {Box, Chip, Typography} from "@mui/material";
import React from "react";

export default function HomeCardsItem({ card }) {
    const chipStyles = {
        parking: { borderColor: 'green', color: 'green' },
        exited: { borderColor: 'red', color: 'red' },
        default: { borderColor: 'gray', color: 'gray' },
    };

    const { borderColor, color } = chipStyles[card.status] || chipStyles.default;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': { boxShadow: 2 },
            }}
        >
            <Box>
                <Typography variant="body1" fontWeight="medium">{card.vehicle_number}</Typography>
                <Typography variant="body2" color="text.secondary">{card.vehicle_type_id}</Typography>
            </Box>
            <Chip
                label={card.status}
                variant="outlined"
                size="small"
                sx={{
                    textTransform: 'capitalize',
                    borderColor,
                    color,
                }}
            />
        </Box>
    );
}
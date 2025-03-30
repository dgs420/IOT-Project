// Styled components
import {styled} from "@mui/material/styles";
import {Box, ListItem, Popper, Typography} from "@mui/material";

export const NotificationPopper = styled(Popper)(({ theme }) => ({
    zIndex: 1000,
    width: 360,
    maxWidth: '90vw',
    '& .MuiPaper-root': {
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[8],
    },
}));

export const NotificationHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
}));

export const NotificationItem = styled(ListItem)(({ theme, is_read }) => ({
    padding: theme.spacing(2),
    backgroundColor: is_read ? 'transparent' : theme.palette.action.hover,
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
    position: 'relative',
}));

export const TimeStamp = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
}));

export const UnreadIndicator = styled(Box)(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: 'translateY(-50%)',
}));
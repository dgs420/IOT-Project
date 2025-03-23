import React, { useState } from 'react';
import {
    Badge,
    Box,
    Button,
    ClickAwayListener,
    Divider,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Popper,
    Typography,
    Avatar,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Update as UpdateIcon,
    MoreHoriz as MoreHorizIcon,
    DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const NotificationPopper = styled(Popper)(({ theme }) => ({
    zIndex: 1000,
    width: 360,
    maxWidth: '90vw',
    '& .MuiPaper-root': {
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[8],
    },
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
}));

const NotificationItem = styled(ListItem)(({ theme, read }) => ({
    padding: theme.spacing(2),
    backgroundColor: read ? 'transparent' : theme.palette.action.hover,
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
    position: 'relative',
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
}));

const UnreadIndicator = styled(Box)(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: 'translateY(-50%)',
}));

// Sample notification data
const notifications = [
    {
        id: 1,
        message: 'Your vehicle card request has been approved.',
        time: '2 minutes ago',
        read: false,
        type: 'success',
    },
    {
        id: 2,
        message: 'Your vehicle card request has been rejected.',
        time: '10 minutes ago',
        read: false,
        type: 'error',
    },
    {
        id: 3,
        message: 'New update available for your app.',
        time: '1 hour ago',
        read: true,
        type: 'info',
    },
    {
        id: 4,
        message: 'Your parking session has ended.',
        time: '3 hours ago',
        read: true,
        type: 'info',
    },
];

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsList, setNotificationsList] = useState(notifications);

    const unreadCount = notificationsList.filter(notification => !notification.read).length;

    const handleToggle = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const markAllAsRead = () => {
        setNotificationsList(notificationsList.map(notification => ({
            ...notification,
            read: true
        })));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon sx={{ color: 'success.main' }} />;
            case 'error':
                return <CancelIcon sx={{ color: 'error.main' }} />;
            case 'info':
            default:
                return <UpdateIcon sx={{ color: 'info.main' }} />;
        }
    };

    return (
        <Box>
            <IconButton
                color="inherit"
                onClick={handleToggle}
                aria-label="notifications"
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <NotificationPopper
                open={open}
                anchorEl={anchorEl}
                transition
                placement="bottom-end"
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={350}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    <NotificationHeader>
                                            Notifications
                                         <Box>
                                            {unreadCount > 0 && (
                                                <Button
                                                    size="small"
                                                    color="inherit"
                                                    startIcon={<DoneAllIcon />}
                                                    onClick={markAllAsRead}
                                                >
                                                    Mark all as read
                                                </Button>
                                            )}
                                        </Box>
                                    </NotificationHeader>

                                    <List sx={{ maxHeight: 320, overflow: 'auto', py: 0 }}>
                                        {notificationsList.length > 0 ? (
                                            notificationsList.map((notification) => (
                                                <React.Fragment key={notification.id}>
                                                    <NotificationItem read={notification.read} alignItems="flex-start">
                                                        {!notification.read && <UnreadIndicator />}
                                                        <ListItemAvatar>
                                                            <Avatar sx={{ bgcolor: 'background.default' }}>
                                                                {getNotificationIcon(notification.type)}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={notification.message}
                                                            secondary={<TimeStamp>{notification.time}</TimeStamp>}
                                                            // primaryTypographyProps={{
                                                            //     fontWeight: notification.read ? 'normal' : 'medium',
                                                            // }}
                                                        />
                                                        <IconButton size="small" edge="end">
                                                            <MoreHorizIcon fontSize="small" />
                                                        </IconButton>
                                                    </NotificationItem>
                                                    <Divider component="li" />
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                                <Typography color="text.secondary">
                                                    No notifications
                                                </Typography>
                                            </Box>
                                        )}
                                    </List>

                                    <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Button size="small" onClick={handleClose}>
                                            View All Notifications
                                        </Button>
                                    </Box>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </NotificationPopper>
        </Box>
    );
}
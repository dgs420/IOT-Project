import React, {useEffect, useState} from 'react';
import {
    Badge, Box, Button, ClickAwayListener, Divider,
    Grow, IconButton, List, Paper, Typography
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { NotificationPopper, NotificationHeader } from './styles';
import { NotificationItem } from './NotificationItem';
import { notifications as initialNotifications } from './mockData';
import {getRequest} from "../../../api/index.jsx";
import {io} from "socket.io-client";

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsList, setNotificationsList] = useState([]);
    const unreadCount = notificationsList.filter(notification => !notification.is_read).length;
    const [socket, setSocket] = useState(null);
    const user_id= localStorage.getItem('user_id');
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
            is_read: true
        })));
    };

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const response = await getRequest('/notification/');
                if (response.code === 200) {
                    setNotificationsList(response.info);
                } else {
                    console.error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
            // setNotificationsList(initialNotifications);
            return () => {
                socket.off("notification"); // Cleanup on unmount
            };

        };
        const newSocket = io('http://localhost:5000'); // Replace with your backend URL
        setSocket(newSocket);
        newSocket.emit("join_notifications", user_id);
        console.log(user_id);
        newSocket.on("notification", (data) => {
            console.log(data);
            getNotifications();

        });
        getNotifications();
        return () =>{
            newSocket.off("scan");
            newSocket.disconnect();
        }
    }, []);

    const sortedNotifications = [...notificationsList].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <Box>
            <IconButton color="inherit" onClick={handleToggle} aria-label="notifications">
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <NotificationPopper open={open} anchorEl={anchorEl} transition placement="bottom-end">
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={350}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    {/* Header */}
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

                                    {/* Notifications List */}
                                    <List sx={{ maxHeight: 320, overflow: 'auto', py: 0 }}>
                                        {sortedNotifications.length > 0 ? (
                                            sortedNotifications.map((notification) => (
                                                <React.Fragment key={notification.id}>
                                                    <NotificationItem notification={notification} />
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

                                    {/* Footer */}
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
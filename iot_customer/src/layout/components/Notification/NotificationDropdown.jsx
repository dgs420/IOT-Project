import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  List,
  Paper,
  Typography,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { NotificationPopper, NotificationHeader } from "./styles";
import { NotificationItem } from "./NotificationItem";
import { getRequest, putRequest } from "../../../api/index.js";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import useUserStore from "../../../store/useUserStore.js";
import { fetchData } from "../../../api/fetchData.js";
import { EventSourcePolyfill } from 'event-source-polyfill';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsList, setNotificationsList] = useState([]);
  const unreadCount = notificationsList.filter(
    (notification) => !notification.is_read
  ).length;
  const [socket, setSocket] = useState(null);
  const { uid, token } = useUserStore((state) => state);
  const handleToggle = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const markAllAsRead = async () => {
    try {
      const response = await putRequest("/notification/read-all");
      if (response.code === 200) {
        setNotificationsList(
          notificationsList.map((notification) => ({
            ...notification,
            is_read: true,
          }))
        );
      } else {
        toast.error(response.message);
        console.error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
  const markAsRead = async (notification_id) => {
    try {
      const response = await putRequest(
        `/notification/read/${notification_id}`
      );
      if (response.code === 200) {
        setNotificationsList(
          notificationsList.map((notification) =>
            notification.notification_id === notification_id
              ? { ...notification, is_read: true }
              : notification
          )
        );
      } else {
        toast.error(response.message);
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  useEffect(() => {
    let eventSource;

    if (uid) {
       eventSource = new EventSourcePolyfill(
        `${import.meta.env.VITE_BASE_URL}/api/sse/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Connecting SSE", uid)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("SSE received:", data);
        setNotificationsList((prev) => [data, ...prev]);
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        // eventSource.close();
      };
    }

    fetchData("/notification", setNotificationsList, null, null);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [uid]);

  const sortedNotifications = [...notificationsList].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

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

                  <List sx={{ maxHeight: 320, overflow: "auto", py: 0 }}>
                    {sortedNotifications.length > 0 ? (
                      sortedNotifications.map((notification) => (
                        <NotificationItem
                          notification={notification}
                          markAsRead={markAsRead}
                          key={notification.notification_id}
                        />
                      ))
                    ) : (
                      <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="text.secondary">
                          No notifications
                        </Typography>
                      </Box>
                    )}
                  </List>

                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
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

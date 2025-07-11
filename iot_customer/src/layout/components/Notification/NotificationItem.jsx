import React from "react";
import {
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  Button,
  Typography,
} from "@mui/material";
import { Done, MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import {
  NotificationItem as StyledNotificationItem,
  UnreadIndicator,
  TimeStamp,
} from "./styles";
import { getNotificationIcon } from "./utils.jsx";

export const NotificationItem = ({ notification, markAsRead }) => (
  <StyledNotificationItem
    is_read={notification.is_read.toString()}
    alignItems="flex-start"
  >
    {!notification.is_read && <UnreadIndicator />}
    <ListItemAvatar>
      <Avatar sx={{ bgcolor: "background.default" }}>
        {getNotificationIcon(notification.type)}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={notification.message}
      secondary={
        <Typography component="span" variant="body2" color="text.secondary">
          {new Date(notification.timestamp).toLocaleString()}
        </Typography>
      }
    />
    {/*<IconButton size="small" edge="end">*/}
    {/*    <MoreHorizIcon fontSize="small" />*/}
    {/*</IconButton>*/}
    {!notification.is_read && (
      <IconButton
        size="small"
        onClick={() => markAsRead(notification.notification_id)}
      >
        {/*Mark as read*/}
        <Done fontSize="small" />
      </IconButton>
    )}
  </StyledNotificationItem>
);

// services/notificationService.js
const Notification = require("../models/notificationModel");
const { sendToUser } = require('./sseService');

exports.getUserNotifications = async (user_id) => {
    return await Notification.findAll({ where: { user_id } });
};

exports.markNotificationAsRead = async (user_id, notification_id) => {
    const notification = await Notification.findOne({
        where: { user_id, notification_id }
    });

    if (!notification) return null;

    if (!notification.is_read) {
        notification.is_read = true;
        await notification.save();
    }

    return notification;
};

exports.markAllNotificationsAsRead = async (user_id) => {
    const [updatedCount] = await Notification.update(
        { is_read: true },
        { where: { user_id, is_read: false } }
    );

    return updatedCount;
};

exports.createAndSendNotification = async (user_id, message, type = {}) => {
    const notification = await Notification.create({
        user_id,
        type,
        message,
        is_read: false,
    });
    sendToUser(user_id, notification, 'notifications');
    return notification;
};

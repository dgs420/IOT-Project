const notificationService = require('../services/notificationService');

exports.getNotification = async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.user_id);
        res.status(200).json({
            code: 200,
            message: "Notifications Successfully Fetched",
            info: notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ code: 500, message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await notificationService.markNotificationAsRead(
            req.user.user_id,
            req.params.notification_id
        );

        if (!notification) {
            return res.status(404).json({ code: 404, message: 'Notification not found' });
        }

        res.status(200).json({
            code: 200,
            message: 'Notification marked as read',
            info: notification,
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ code: 500, message: 'Server error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const count = await notificationService.markAllNotificationsAsRead(req.user.user_id);
        res.status(200).json({
            code: 200,
            message: `${count} notifications marked as read.`,
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ code: 500, message: 'Server error' });
    }
};

exports.sendNotification = notificationService.createAndSendNotification;

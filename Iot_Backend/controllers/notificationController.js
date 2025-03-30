const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');
const Notification = require("../models/notificationModel");
const { mqttEventEmitter } = require('../services/eventEmitter');

exports.getNotification = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const notifications = await Notification.findAll({
            where: {
                user_id // Filter by card IDs
            }
        });
        // if (notifications.length === 0) {
        //     return res.status(404).json({
        //         code: 404,
        //         message: 'You have not registered any RFID cards.' });
        // }

        res.status(200).json({
            code:200,
            message: "Notifications Successfully Fetched",
            info: notifications});
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            code:500,
            message: 'Server error' });
    }

};

exports.markAsRead = async (req, res) => {
    const { notification_id } = req.params;
    const user_id = req.user.user_id;

    try {
        const notification = await Notification.findOne({
            where: {
                notification_id,
                user_id
            }
        });

        if (!notification) {
            return res.status(404).json({
                code: 404,
                message: 'Notification not found'
            });
        }
        if (!notification.is_read) {
            notification.is_read = true;
            await notification.save();
        }


        res.status(200).json({
            code: 200,
            message: 'Notification marked as read',
            info: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            code: 500,
            message: 'Server error'
        });
    }
}


exports.sendNotification = async (user_id, message, type = {}) => {
    try {
        // Create a new notification in the database
        const notification = await Notification.create({
            user_id,
            type,
            message,
            is_read: false,
        });

        mqttEventEmitter.emit('notification', { user_id });
        return notification;
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
};
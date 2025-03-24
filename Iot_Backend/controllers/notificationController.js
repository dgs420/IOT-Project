const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');
const Notification = require("../models/notificationModel");
// const RfidCard=require("../models/rfidCardModel");

exports.getYourNotification = async (req, res) => {
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
const Session = require('../models/parkingSessionModel');
const TrafficLog = require("../models/trafficLogModel");

exports.getAllSessions = async (req, res) => {
    try {
        const logs = await Session.findAll();
        res.status(200).json({
            code: 200,
            message: "All session fetched",
            info: logs
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Server error',
            error: error.message
            });
    }
}
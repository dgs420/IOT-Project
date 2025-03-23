const Session = require('../models/parkingSessionModel');
const TrafficLog = require("../models/trafficLogModel");

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.findAll();
        res.status(200).json({
            code: 200,
            message: "All sessions fetched",
            info: sessions
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
            });
    }
}
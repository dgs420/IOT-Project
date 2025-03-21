const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');
const TrafficLog = require("../models/trafficLogModel");
// const RfidCard=require("../models/rfidCardModel");
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getHomeCount = async (req, res) => {
    try {
        // Count total RFID cards
        const vehiclesCount = await RfidCard.count();
        const startOfDay = moment().startOf('day').toDate();
        // Count parking cards
        const vehiclesIn = await RfidCard.count({
            where: {status: 'parking'}
        });

        // Count exited cards
        const vehiclesExited = await RfidCard.count({
            where: {status: 'exited'}
        });

        const trafficToday = await TrafficLog.count({
            where: {
                time: {
                    [Op.gte]: startOfDay,
                },
            },
        });

        // Send back the counts in the response
        res.json({
            code: 200,
            message: 'RFID card created successfully.',
            info: {
                total_vehicles: vehiclesCount,
                vehicles_in: vehiclesIn,
                vehicles_exited: vehiclesExited,
                traffic_today: trafficToday,
            }
        });
    } catch (error) {
        console.error('Error fetching vehicle counts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
exports.getVehicleCountsByType = async (req, res) => {
    try {
        const vehicleCounts = await RfidCard.findAll({
            attributes: [
                'vehicle_type',
                [sequelize.fn('COUNT', sequelize.col('vehicle_type')), 'count']
            ],
            group: ['vehicle_type']
        });

        res.status(200).json({
            code: 200,
            message: 'Vehicle counts by type retrieved successfully.',
            info: vehicleCounts
        });
    } catch (error) {
        console.error('Error fetching vehicle counts by type:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
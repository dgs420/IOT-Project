const TrafficLog = require("../models/trafficLogModel");
const Vehicle=require("../models/vehicleModel");
const Request=require("../models/requestModel")
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getHomeCount = async (req, res) => {
    try {
        // Count total RFID cards
        const vehiclesCount = await Vehicle.count();
        const startOfDay = moment().startOf('day').toDate();
        // Count parking cards
        const vehiclesIn = await Vehicle.count({
            where: {status: 'parking'}
        });

        // Count exited cards
        const vehiclesExited = await Vehicle.count({
            where: {status: 'exited'}
        });

        const pendingRequests = await Request.count({
            where: {status: 'pending'}
        });

        const trafficToday = await TrafficLog.count({
            where: {
                time: {
                    [Op.gte]: startOfDay,
                },
                is_valid: true 
            },
        });

        // Send back the counts in the response
        res.json({
            code: 200,
            message: 'RFID card created successfully.',
            info: {
                pending_requests: pendingRequests,
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
        const vehicleCounts = await Vehicle.findAll({
            attributes: [
                'vehicle_type_id',
                [sequelize.fn('COUNT', sequelize.col('vehicle_type_id')), 'count']
            ],
            group: ['vehicle_type_id']
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
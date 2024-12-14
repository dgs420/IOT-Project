const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');
const TrafficLog = require("../models/trafficLogModel");
// const RfidCard=require("../models/rfidCardModel");
const sequelize = require('../config/database');


exports.getHomeCount = async (req, res) => {
    try {
        // Count total RFID cards
        const vehiclesCount = await RfidCard.count();

        // Count parking cards
        const vehiclesIn = await RfidCard.count({
            where: {status: 'parking'}
        });

        // Count exited cards
        const vehiclesExited = await RfidCard.count({
            where: {status: 'exited'}
        });

        // Send back the counts in the response
        res.json({
            code: 200,
            message: 'RFID card created successfully.',
            info: {
                total_vehicles: vehiclesCount,
                vehicles_in: vehiclesIn,
                vehicles_exited: vehiclesExited
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
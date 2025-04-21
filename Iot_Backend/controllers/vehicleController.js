const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
// const RfidCard=require("../models/rfidCardModel");

exports.getAllVehicles = async (req, res) => {
    

    try {
        const vehicles = await Vehicle.findAll();
        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'No vehicles found' });
        }

        res.status(200).json({
            code:200,
            message: "All vehicles Successfully Fetched",
            info: vehicles});
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            code:500,
            message: 'Server error' });
    }
};

exports.getVehiclesByUserId = async (req, res) => {
    const {userId} = req.params;;

    try {
        const vehicles = await Vehicle.findAll({
            where: {
                user_id: userId
            }
        });
        if (vehicles.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'User have not registered any vehicles.' });
        }

        res.status(200).json({
            code:200,
            message: "Vehicles Successfully Fetched",
            info: vehicles});
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            code:500,
            message: 'Server error' });
    }
};

exports.getYourVehicles = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const vehicles = await Vehicle.findAll({
            where: {
                user_id // Filter by card IDs
            }
        });
        if (vehicles.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'You have not registered any Vehicles.' });
        }

        res.status(200).json({
            code:200,
            message: "Vehicles Successfully Fetched",
            info: vehicles});
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            code:500,
            message: 'Server error' });
    }
};


exports.getYourRecentVehicles = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const cards = await Vehicle.findAll({
            where: {
                user_id
            },
            order: [['updated_at', 'DESC']],
            limit: 5
        });
        if (cards.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'You have not registered any vehicles.' });
        }

        res.status(200).json({
            code:200,
            message: "Vehicles Successfully Fetched",
            info: cards});
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            code:500,
            message: 'Server error' });
    }
}
exports.createVehicle = async (req, res) => {
    const { user_id, vehicle_number, vehicle_type_id } = req.body;

    try {
        const existingVehicle = await Vehicle.findOne({
            where: { vehicle_number }
        });

        if (existingVehicle) {
            return res.json({
                code:400,
                message: 'This vehicle is already registered.' });
        }

        // Create a new card
        const newVehicle = await Vehicle.create({
            user_id,
            vehicle_number,
            vehicle_type_id,
            status: 'exited', // Default status
        });

        res.status(201).json({
            code:200,
            message: 'Vehicle created successfully.',
            info: newVehicle,
        });
    } catch (error) {
        console.error('Error creating Vehicle:', error);
        res.json({
            code:500,
            message: 'Server error.' });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { cardId } = req.params;
    //todo
    try {
        // Find the user by primary key
        const card = await RfidCard.findByPk(cardId);
        if (!card) {
            return res.status(404).json({
                code: 404,
                message: 'Card not found.',
            });
        }

        // Check if the user has associated RFID cards


        // Delete the user
        await card.destroy();

        res.status(200).json({
            code: 200,
            message: 'Card deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting Card:', error);
        res.json({
            code: 500,
            error: 'Failed to delete Card.',
        });
    }
};
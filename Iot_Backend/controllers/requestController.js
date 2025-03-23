const Request = require('../models/requestModel');
const RfidCard = require("../models/rfidCardModel");

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.findAll();
        res.status(200).json({
            code: 200,
            message: "All requests fetched",
            info: requests
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}

exports.createRequest = async (req, res) => {
    const {vehicle_number, vehicle_type, name, contact_number,delivery_address} = req.body;
    const user_id = req.user.user_id;
    try {

        // Check if a card is already associated with this vehicle
        const vehicleCard = await RfidCard.findOne({
            where: { vehicle_number }
        });

        if (vehicleCard) {
            return res.json({
                code:400,
                message: 'A card is already associated with this vehicle.' });
        }

        // Create a new card
        const newRequest = await Request.create({
            user_id,
            vehicle_number,
            vehicle_type,
            name, contact_number,delivery_address
        });

        res.status(201).json({
            code:200,
            message: 'RFID card created successfully.',
            info: newRequest,
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.json({
            code:500,
            message: error.message});
    }
}
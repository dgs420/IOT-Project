const Request = require('../models/requestModel');
const RfidCard = require("../models/rfidCardModel");
const User = require("../models/userModel");
const { sendNotification } = require('./notificationController');

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

exports.getYourRequests = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const requests = await Request.findAll({
            where: { user_id  }
        });
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
        const existingRequest = await Request.findOne({
            where: { vehicle_number, status :'pending' }
        })
        if (vehicleCard) {
            return res.json({
                code:400,
                message: 'A card is already associated with this vehicle.' });
        }

        if (existingRequest) {
            return res.json({
                code:400,
                message: 'A request is already sent this vehicle.' });
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

exports.rejectRequest = async (req, res) => {
    const request_id = req.params.requestId;
    const reason = req.body.reason;
    try{
        const request = await Request.findByPk(request_id );
        if(!request){
            return res.status(404).json({
                code:404,
                message:'Request not found'});
        }

        await request.update({ status: 'rejected' , reason: reason});

        sendNotification(user_id=request.user_id, message = `Your request for vehicle ${request.vehicle_number} has been rejected. Reason: ${reason}`, type = 'fail' );

        res.status(200).json({
            code:200,
            message:"Request rejected",
            info:"hehe"});
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve request' });
    }
}

exports.approveRequest = async (req, res) => {
    const { requestId } = req.params;
    const { card_number } = req.body;  // Get card number from request body

    try {
        const request = await Request.findByPk(requestId);
        if (!request) {
            return res.status(404).json({
                code: 404,
                message: 'Request not found',
            });
        }

        const vehicleCard = await RfidCard.findOne({
            where: { vehicle_number: request.vehicle_number }
        });

        if (vehicleCard) {
            return res.json({
                code:400,
                message: 'A card is already associated with this vehicle.' });
        }

        // Create a new RFID card entry
        const newCard = await RfidCard.create({
            card_number,
            user_id: request.user_id,
            vehicle_number: request.vehicle_number,
            vehicle_type: request.vehicle_type,
            status: 'exited', // Default status
        });

        // Update the request status to approved
        await request.update({ status: 'approved' });
        sendNotification(user_id=request.user_id, message = `Your request for vehicle ${request.vehicle_number} has been approved`, type = 'success' );


        return res.status(200).json({
            code: 200,
            message: 'Request approved successfully',
            info: newCard, // Send created card info
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to approve request' });
    }
};
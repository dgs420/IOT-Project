const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');
const TrafficLog = require("../models/trafficLogModel");
// const RfidCard=require("../models/rfidCardModel");

exports.getRfidCardsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const cards = await RfidCard.findAll({
            where: {
                user_id: userId // Filter by card IDs
            }
        });
        if (cards.length === 0) {
            return res.status(404).json({ message: 'No RFID cards found for this user ID.' });
        }
        // Fetch the user and include RFID cards
        // const user = await User.findByPk(userId, {
        //     include: [{ model: RfidCard, as: 'rfid_cards' }],
        // });
        //
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        res.status(200).json({
            code:200,
            message: "RFID Successfully Fetched",
            info: cards});
    } catch (error) {
        console.error('Error fetching RFID cards:', error);
        res.status(500).json({
            code:500,
            message: 'Server error' });
    }
};
exports.createRfidCard = async (req, res) => {
    const { card_number, user_id, vehicle_number, vehicle_type } = req.body;

    try {
        // Check if the card already exists
        const existingCard = await RfidCard.findOne({
            where: { card_number }
        });

        if (existingCard) {
            return res.status(400).json({
                code:400,
                message: 'Card number already exists.' });
        }

        // Check if a card is already associated with this vehicle
        const vehicleCard = await RfidCard.findOne({
            where: { vehicle_number }
        });

        if (vehicleCard) {
            return res.status(400).json({
                code:200,
                message: 'A card is already associated with this vehicle.' });
        }

        // Create a new card
        const newCard = await RfidCard.create({
            card_number,
            user_id,
            vehicle_number,
            vehicle_type,
            status: 'parking', // Default status
        });

        res.status(201).json({
            code:200,
            message: 'RFID card created successfully.',
            info: newCard,
        });
    } catch (error) {
        console.error('Error creating RFID card:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getRfidCardsById = async (req, res) => {}
exports.deleteCard = async (req, res) => {}
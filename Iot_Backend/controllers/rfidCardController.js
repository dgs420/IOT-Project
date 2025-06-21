const RfidCard = require('../models/rfidCardModel');

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
exports.getYourRfidCards = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const cards = await RfidCard.findAll({
            where: {
                user_id // Filter by card IDs
            }
        });
        if (cards.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'You have not registered any RFID cards.' });
        }

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
exports.getYourRecentRfidCards = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const cards = await RfidCard.findAll({
            where: {
                user_id
            },
            order: [['updated_at', 'DESC']],
            limit: 5
        });
        if (cards.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'You have not registered any RFID cards.' });
        }

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
}
exports.createRfidCard = async (req, res) => {
    const { card_number, user_id, vehicle_number, vehicle_type } = req.body;

    try {
        // Check if the card already exists
        const existingCard = await RfidCard.findOne({
            where: { card_number }
        });

        if (existingCard) {
            return res.json({
                code:400,
                message: 'Card number already exists.' });
        }

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
        const newCard = await RfidCard.create({
            card_number,
            user_id,
            vehicle_number,
            vehicle_type,
            status: 'exited', // Default status
        });

        res.status(201).json({
            code:200,
            message: 'RFID card created successfully.',
            info: newCard,
        });
    } catch (error) {
        console.error('Error creating RFID card:', error);
        res.json({
            code:500,
            message: 'Server error.' });
    }
};

exports.deleteCard = async (req, res) => {
    const { cardId } = req.params;

    try {
        // Find the user by primary key
        const card = await RfidCard.findByPk(cardId);
        if (!card) {
            return res.status(404).json({
                code: 404,
                message: 'Card not found.',
            });
        }

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
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

        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching RFID cards:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const RfidCard = require('../models/rfidCardModel');
const User = require('../models/userModel');

exports.getRfidCardsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch the user and include RFID cards
        const user = await User.findByPk(userId, {
            include: [{ model: RfidCard, as: 'rfid_cards' }],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.rfid_cards);
    } catch (error) {
        console.error('Error fetching RFID cards:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

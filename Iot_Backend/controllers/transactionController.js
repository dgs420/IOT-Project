const Transaction = require('../models/TransactionModel');
// Get user transaction history
exports.getTransactions = async (req, res) => {
    try {
        const user_id = req.user.id;
        const transactions = await Transaction.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const Transaction = require('../models/TransactionModel');
// Get user transaction history
exports.getYourTransactions = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const transactions = await Transaction.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            code:200,
            message: "Recent transaction found",
            info: transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getRecentTransactions = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const transactions = await Transaction.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.status(200).json({
            code:200,
            message: "Recent transaction found",
            info: transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}
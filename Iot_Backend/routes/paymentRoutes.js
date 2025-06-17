
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const {getYourTransactions} = require("../controllers/transactionController");
const transactionController = require("../controllers/transactionController");
const paymentController = require("../controllers/paymentController");
const requireRole = require("../middleware/requireRole");
// Use requireAuth middleware for all routes except webhook
router.use('/webhook', express.raw({ type: "application/json" }));

router.post("/top-up",requireAuth, paymentController.createTopUp);

router.get("/balance",requireAuth, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User not found" });
        }

        res.json({
            code: 200,
            message: "User balance",
            info: {
                balance: user.balance
            }
             });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({
            code: 500,
            error: error.message });
    }
});

router.get("/all-transactions",requireAuth, requireRole(['manager','admin']), transactionController.getAllTransactions);
router.get("/all-transactions-orm",requireAuth, requireRole(['manager','admin']), transactionController.getAllTransactionsORM);
router.get("/transactions-summary",requireAuth, requireRole(['manager','admin']), transactionController.getTransactionSummary);
router.get("/transactions-cash",requireAuth, requireRole(['manager','admin']), transactionController.getDeviceCashFlow);
router.get("/transactions-daily",requireAuth, requireRole(['manager','admin']), transactionController.getDailyRevenue);
router.get("/device-cash-daily",requireAuth, requireRole(['manager','admin']), transactionController.getDeviceCashByDay);
router.get("/transactions",requireAuth, transactionController.getYourTransactions);
router.get("/recent-transactions",requireAuth, transactionController.getRecentTransactions);
router.get("/export-transactions",requireAuth, transactionController.exportTransactionsExcel); 

// This route should be exempt from requireAuth middleware
router.post("/webhook", paymentController.handleWebhook);


router.use(requireAuth);

module.exports = router;
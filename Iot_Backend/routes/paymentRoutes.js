
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/UserModel");
const Transaction = require("../models/TransactionModel");
const {getYourTransactions} = require("../controllers/transactionController");
const transactionController = require("../controllers/transactionController");

// Use requireAuth middleware for all routes except webhook
router.use('/webhook', express.raw({ type: "application/json" }));

router.post("/top-up",requireAuth, async (req, res) => {
    try {
        const { amount, currency,metadata  } = req.body;
        const user_id = req.user.user_id; // Get user ID from auth middleware

        if (!amount || !currency) {
            return res.status(400).json({ error: "Amount and currency are required." });
        }

        // Validate amount (positive number)
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest currency unit (cents)
            currency,
            payment_method_types: ["card"],
            metadata: { user_id: String(user_id) }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get account balance
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

// // Get transaction history
// router.get("/recent-transactions",requireAuth, async (req, res) => {
//     try {
//         const user_id = req.user.user_id;
//         const transactions = await Transaction.findAll({
//             where: { user_id },
//             order: [['createdAt', 'DESC']],
//             limit: 10
//         });
//
//         res.status(200).json({
//             code:200,
//             message: "Recent transaction found",
//             info: transactions });
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         res.status(500).json({
//             code: 500,
//             message: error.message
//         });
//     }
// });

router.get("/transactions",requireAuth, transactionController.getYourTransactions);
router.get("/recent-transactions",requireAuth, transactionController.getRecentTransactions);


// This route should be exempt from requireAuth middleware
router.post("/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        try {
            // Get user ID from Stripe metadata
            const user_id = paymentIntent.metadata.user_id;
            // console.log(paymentIntent);
            // Convert amount to correct currency format (cents to dollars)
            const amount = paymentIntent.amount / 100;

            // Find user and update balance
            const user = await User.findOne({ where: { user_id } });

            if (user) {
                const newBalance = user.balance + amount;
                await user.update({ balance: newBalance });
                console.log(`✅ Balance updated for user ${user_id}. New balance: ${newBalance}`);

                // Create transaction record
                await Transaction.create({
                    user_id,
                    amount,
                    balance: newBalance,
                    transaction_type: 'top-up',
                    payment_method: 'stripe',
                    payment_id: paymentIntent.id, // Store Stripe transaction ID for reference
                    status: 'completed'
                });
            } else {
                console.log(`❌ User not found: ${user_id}`);
            }
        } catch (error) {
            console.error("Database update error:", error);
            // Don't send error response to Stripe - they'll retry
            // Just log it and return 200 to acknowledge receipt
        }
    }

    // Always return a 200 response to acknowledge receipt of the webhook
    res.json({ received: true });
});
router.use(requireAuth);

module.exports = router;
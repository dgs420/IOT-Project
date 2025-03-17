const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.use(requireAuth);

router.post("/top-up", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: "Amount and currency are required." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to smallest currency unit (cents)
            currency,
            payment_method_types: ["card"], // Specify payment method
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

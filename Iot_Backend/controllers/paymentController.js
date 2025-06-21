const paymentService = require("../services/paymentService");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createTopUp = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const user_id = req.user.user_id;
    if (!amount || !currency) {
      return res
        .status(400)
        .json({ error: "Amount and currency are required." });
    }

    const clientSecret = await paymentService.createTopUpIntent(
      user_id,
      amount,
      currency
    );
    res.json({ clientSecret });
  } catch (error) {
    console.error("Top-up error:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const result = await paymentService.handleStripeWebhook(req, sig);
    res.status(200).json(result);
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
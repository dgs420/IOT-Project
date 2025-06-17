const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

exports.createTopUpIntent = async (user_id, amount, currency) => {
  if (!amount || !currency) {
    throw new Error("Amount and currency are required.");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    payment_method_types: ["card"],
    metadata: { user_id: String(user_id) },
  });

  return paymentIntent.client_secret;
};

exports.handleStripeWebhook = async (req, sig) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error(`Invalid Stripe signature: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const user_id = paymentIntent.metadata.user_id;
    const amount = paymentIntent.amount / 100;

    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      console.warn(`❌ User not found for user_id: ${user_id}`);
      return;
    }

    const newBalance = user.balance + amount;
    await user.update({ balance: newBalance });

    await Transaction.create({
      user_id,
      amount,
      balance: newBalance,
      transaction_type: "top-up",
      payment_method: "stripe",
      payment_id: paymentIntent.id,
      status: "completed",
    });

    await createAndSendNotification(
        user_id,
        `You sucessfully added $${amount} to your account. You now have $${newBalance} in your account.`,
        "sucess"
      );

    console.log(
      `✅ Balance updated for user ${user_id}. New balance: ${newBalance}`
    );
  }

  return { received: true };
};

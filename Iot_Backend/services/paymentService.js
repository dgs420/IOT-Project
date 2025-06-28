const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const { createAndSendNotification } = require("./notificationService");
const sequelize = require("../config/database");

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

    const t = await sequelize.transaction();
    try {
      const user = await User.findOne({ where: { user_id }, transaction: t });
      if (!user) {
        console.warn(`❌ User not found for user_id: ${user_id}`);
        await t.rollback();
        return;
      }

      const currentBalance = parseFloat(user.balance);
      const newBalance = currentBalance + amount;

      await user.update({ balance: newBalance }, { transaction: t });

      await Transaction.create(
        {
          user_id,
          amount,
          balance: newBalance,
          transaction_type: "top-up",
          payment_method: "stripe",
          payment_id: paymentIntent.id,
          status: "completed",
        },
        { transaction: t }
      );

      await t.commit();

      await createAndSendNotification(
        user_id,
        `You successfully added $${amount.toFixed(
          2
        )} to your account. You now have $${newBalance.toFixed(
          2
        )} in your account.`,
        "success"
      );

      console.log(
        `✅ Balance updated for user ${user_id}. New balance: ${newBalance}`
      );
    } catch (error) {
      await t.rollback();
      console.error(`❌ Failed to process payment for user ${user_id}:`, error);
      throw error;
    }
  }

  return { received: true };
};

exports.topUpCash = async (user_id, amount) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { user_id }, transaction: t });
    if (!user) throw { code: 404, message: "User does not exist" };

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      throw { code: 400, message: "Invalid top-up amount" };
    }
    const currentBalance = parseFloat(user.balance || 0);
    const newBalance = currentBalance + amount;

    await user.update({ balance: newBalance }, { transaction: t });

    await Transaction.create(
      {
        user_id,
        amount,
        balance: newBalance,
        transaction_type: "top-up",
        payment_method: "cash",
        status: "completed",
      },
      { transaction: t }
    );

    await t.commit();

    await createAndSendNotification(
      user_id,
      `You successfully added $${amount.toFixed(
        2
      )} to your account. You now have $${newBalance.toFixed(
        2
      )} in your account.`,
      "success"
    );

    return `Successfully added $${amount.toFixed(2)} to account.`;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

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
  } else if (event.type === "payment_link.payment_succeeded") {
    const paymentLink = event.data.object;
    const session_id = paymentLink.metadata.session_id;
    const embed_id = paymentLink.metadata.embed_id;
    const user_id = paymentLink.metadata.user_id;
    const amount = paymentLink.amount_total / 100;

    const session = await ParkingSession.findOne({ where: { session_id } });
    if (!session) {
      console.warn(
        `❌ Parking session not found for session_id: ${session_id}`
      );
      return;
    }

    const vehicle = await Vehicle.findOne({
      where: { vehicle_id: session.vehicle_id },
    });
    const user =
      user_id !== "guest" ? await User.findOne({ where: { user_id } }) : null;

    await Sequelize.transaction(async (t) => {
      await session.update(
        {
          exit_time: new Date(),
          status: "completed",
          payment_status: "paid",
          fee: amount,
        },
        { transaction: t }
      );

      await vehicle.update(
        { status: "exited" },
        { transaction: t, hooks: false }
      );

      await Transaction.create(
        {
          user_id: user ? user.user_id : null,
          amount,
          balance: user ? user.balance : 0,
          transaction_type: "fee",
          payment_method: "stripe",
          payment_id: paymentLink.id,
          status: "completed",
          session_id,
        },
        { transaction: t }
      );
    });

    // Notify ESP32 via MQTT
    const client = require("../config/mqttClient").getClient();
    client.publish(
      `barrier/exit/response/${embed_id}`,
      JSON.stringify({
        status: "valid",
        message: "Payment link payment confirmed",
        vehicle_plate: vehicle.vehicle_plate,
        fee: amount,
        payment_method: "stripe",
      })
    );

    if (user) {
      await createAndSendNotification(
        user.user_id,
        `Payment of $${amount} via payment link received for vehicle ${vehicle.vehicle_plate}.`,
        "success"
      );
    }
  }

  return { received: true };
};

exports.createPaymentLink = async ({
  user_id,
  amount,
  currency,
  session_id,
  embed_id,
  vehicle_plate,
}) => {
  if (!amount || !currency || !session_id || !embed_id) {
    throw new Error("Amount, currency, session_id, and embed_id are required.");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  // Create a product for the payment
  const product = await stripe.products.create({
    name: `Parking Fee for Vehicle ${vehicle_plate || "Guest"}`,
    metadata: { user_id: String(user_id || "guest"), session_id, embed_id },
  });

  // Create a price for the product
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(amount * 100),
    currency,
  });

  // Create a payment link with a 5-minute expiration
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    after_completion: {
      type: "redirect",
      redirect: {
        url: process.env.SUCCESS_URL || "https://yourapp.com/success",
      },
    },
    // expires_at: Math.floor(Date.now() / 1000) + 5 * 60,
    metadata: { user_id: String(user_id || "guest"), session_id, embed_id },
  });
  setTimeout(async () => {
    try {
      await stripe.paymentLinks.update(paymentLink.id, { active: false });
      console.log(`Payment link ${paymentLink.id} deactivated after 5 minutes`);
    } catch (err) {
      console.error(
        `Failed to deactivate payment link ${paymentLink.id}:`,
        err
      );
    }
  }, 5 * 60 * 1000);
  return {
    url: paymentLink.url,
    payment_link_id: paymentLink.id,
  };
};

exports.handleTopUpCash = async (user_id, amount) => {
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

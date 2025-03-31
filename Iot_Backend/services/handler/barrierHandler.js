const Device = require("../../models/deviceModel.js");
const RfidCard = require("../../models/rfidCardModel");
const TrafficLog = require("../../models/trafficLogModel");
const ParkingSession = require("../../models/parkingSessionModel"); // New table
const User = require("../../models/userModel");
const Notificartion = require("../../models/notificationModel");
const Transaction = require("../../models/transactionModel");
const { mqttEventEmitter } = require("../eventEmitter");
const { getClient } = require("../mqttClient");
const { sendNotification } = require("../../controllers/notificationController.js");
// const EventEmitter = require("events");
// const client  = getClient ();
function calculateFee(entryTime, exitTime) {
  const ratePerHour = 10; // Change this based on your pricing
  const durationMs = exitTime - entryTime;
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Convert to hours and round up

  return durationHours * ratePerHour;
}
async function barrierHandler(client, topic, data) {
  // const client = getClient();
  // console.log(data);
  const { card_number, embed_id, action } = data;
  // mqttEventEmitter.emit('mqttMessage', { embed_id, card_number, action, message: null });
  if (!embed_id || !card_number || !action) {
    console.error("Invalid barrier message:", data);
    mqttEventEmitter.emit("mqttMessage", {
      embed_id,
      card_number,
      action,
      message: "Missing fields",
    });
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({ status: "invalid", message: "Missing fields" })
    );
  }

  const device = await Device.findOne({ where: { embed_id } });
  if (!device) {
    const error = !device ? "Device not found" : "Card not found";
    mqttEventEmitter.emit("mqttMessage", {
      embed_id,
      card_number,
      vehicle_number: null,
      action,
      message: error,
    });
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({ status: "invalid", message: error })
    );
  }
  const card = await RfidCard.findOne({
    where: { card_number },
    include: { model: User },
  });
  if (!card || !card.user) {
    mqttEventEmitter.emit("scan", {
      status: "fail",
      embed_id,
      action,
      message: `Card or user not found`,
    });
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({ status: "invalid", message: "Card or user not found" })
    );
  }

  const user = card.user;

  const logAction = action === "enter" ? "enter" : "exit";
  if (action === "enter" && card.status === "exited") {
    await card.update({ status: "parking" });
    await ParkingSession.create({
      card_id: card.card_id,
      device_id: device.device_id,
      vehicle_number: card.vehicle_number,
      entry_time: new Date(),
      status: "active",
    });
    mqttEventEmitter.emit("scan", {
      success: true,
      embed_id,
      action,
      message: `Valid card`,
    });
  } else if (action === "exit" && card.status === "parking") {
    const session = await ParkingSession.findOne({
      where: { card_id: card.card_id, status: "active" },
    });

    if (!session) {
      mqttEventEmitter.emit("scan", {
        status: "fail",
        embed_id,
        card_number,
        vehicle_number: card.vehicle_number,
        action,
        message: `Invalid ${logAction} status`,
      });
      return client.publish(
        `${topic}/response/${embed_id}`,
        JSON.stringify({
          success: false,
          message: `Invalid ${logAction} status`,
        })
      );
    }
    const exit_time = new Date();
    const fee = calculateFee(session.entry_time, exit_time);

    if (user.balance < fee) {
      
      sendNotification(
        (user_id = user.user_id),
        (message = `Insufficient balance for exit fee of ${fee}$ vehicle ${card.vehicle_number} `),
        (type = "warning")
      );

      return client.publish(
        `${topic}/response/${embed_id}`,
        JSON.stringify({ success: false, message: "Insufficient balance" })
      );
    }

    await user.update({ balance: user.balance - fee });
    await session.update({
      exit_time: exit_time,
      status: "completed",
      payment_status: "paid",
      fee: fee,
    });
    await Transaction.create({
      user_id: user.user_id,
      balance: user.balance,
      amount: fee,
      status: "completed",
      payment_method: "credit",
      transaction_type: "fee",
    });
    await card.update({ status: "exited" });
    mqttEventEmitter.emit("scan", {
      success: true,
      embed_id,
      action,
      message: `Valid card`,
    });
  } else {
    mqttEventEmitter.emit("scan", {
      success: false,
      embed_id,
      card_number,
      vehicle_number: card.vehicle_number,
      action,
      message: `Invalid ${logAction} status`,
    });
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({ success: false, message: `Invalid ${logAction} status` })
    );
  }

  await TrafficLog.create({
    card_id: card.card_id,
    device_id: device.device_id,
    action: logAction,
    time: new Date(),
  });
  client.publish(
    `${topic}/response/${embed_id}`,
    JSON.stringify({ success: true, message: `${logAction} logged` })
  );
  mqttEventEmitter.emit("mqttMessage", {
    embed_id,
    card_number,
    vehicle_number: card.vehicle_number,
    action,
    message: `${logAction} logged`,
  });
}

module.exports = { barrierHandler };

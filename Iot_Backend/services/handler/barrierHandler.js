const Device = require("../../models/deviceModel.js");
const RfidCard = require("../../models/rfidCardModel");
const TrafficLog = require("../../models/trafficLogModel");
const ParkingSession = require("../../models/parkingSessionModel");
const User = require("../../models/userModel");
const Notification = require("../../models/notificationModel");
const Vehicle = require("../../models/vehicleModel");
const VehicleType = require("../../models/vehicleTypeModel");
const Transaction = require("../../models/transactionModel");
const { mqttEventEmitter } = require("../eventEmitter");
const { getClient } = require("../mqttClient");
const {
  sendNotification,
} = require("../../controllers/notificationController.js");
const { isParkingFull } = require("../helper/helper.js");
// const EventEmitter = require("events");
// const client  = getClient ();
async function calculateFee(entryTime, exitTime, vehicleTypeId) {
  // Fetch the vehicle type to get the fee per hour
  const vehicleType = await VehicleType.findByPk(vehicleTypeId);

  if (!vehicleType) {
    throw new Error("Vehicle type not found");
  }

  const ratePerHour = vehicleType.fee_per_hour;
  const durationMs = exitTime - entryTime;
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Convert to hours and round up

  return durationHours * ratePerHour;
}

async function barrierHandler(client, topic, data) {
  const { card_number, embed_id, action } = data;

  if (!embed_id || !card_number || !action) {
    console.error("Invalid barrier message:", data);
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({ status: "invalid", message: "Missing fields" })
    );
  }

  const device = await Device.findOne({ where: { embed_id } });
  if (!device) {
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({ status: "invalid", message: "Device not found" })
    );
  }

  // Find the RFID card
  const card = await RfidCard.findOne({
    where: { card_number },
    include: [{ model: User }],
  });

  if (!card || !card.user) {
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({
        status: "invalid",
        vehicle_number: 'N/A',
        message: "Card or user not found",
      })
    );
  }

  // Find the vehicle associated with the card
  const vehicle = await Vehicle.findOne({
    where: { card_id: card.card_id },
    include: [{ model: VehicleType }],
  });

  if (!vehicle) {
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({
        status: "invalid",
        vehicle_number: 'N/A',
        message: `Vehicle not found for card ${card_number}`,
      })
    );
  }

  if (vehicle.status === "blocked") {
    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({
        status: "invalid",
        vehicle_number: vehicle.vehicle_number,
        message: "Vehicle is blocked",
      })
    );
  }

  const user = card.user;

  if (user.balance <= 0) {
    sendNotification(user.user_id, `Insufficient balance to park`, "warning");

    return client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({
        status: "invalid",
        vehicle_number: vehicle.vehicle_number,
        message: "Insufficient balance",
        fee: fee,
      })
    );
  }

  const logAction = action === "enter" ? "enter" : "exit";

  if (action === "enter") {
    if (vehicle.status !== "exited") {
      return client.publish(
        `${topic}/response/${embed_id}`,
        JSON.stringify({
          status: "invalid",
          vehicle_number: vehicle.vehicle_number,
          message: "Vehicle is already inside",
        })
      );
    }

    if (await isParkingFull(vehicle.vehicle_type_id)) {
      return client.publish(
        `${topic}/response/${embed_id}`,
        JSON.stringify({
          status: "invalid",
          vehicle_number: vehicle.vehicle_number,
          message: "Parking space full",
        })
      );
    }

    await vehicle.update({ status: "parking" });
    await ParkingSession.create({
      vehicle_id: vehicle.vehicle_id,
      // device_id: device.device_id,
      // vehicle_number: vehicle.vehicle_number,
      entry_time: new Date(),
      status: "active",
    });

    client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({
        status: "valid",
        message: "Entry logged",
        vehicle_number: vehicle.vehicle_number,
      })
    );
  } else if (action === "exit") {
    const session = await ParkingSession.findOne({
      where: { vehicle_id: vehicle.vehicle_id, status: "active" },
    });

    if (!session) {
      return client.publish(
        `${topic}/response/${embed_id}`,
        JSON.stringify({
          status: "invalid",
          vehicle_number: vehicle.vehicle_number,
          message: "No active parking session found",
        })
      );
    }

    const exit_time = new Date();
    const fee = await calculateFee(
      session.entry_time,
      exit_time,
      vehicle.vehicle_type_id
    );

    if (user.balance < fee) {
      sendNotification(
        user.user_id,
        `Insufficient balance for exit fee of $${fee} for vehicle ${vehicle.vehicle_number}`,
        "warning"
      );

      return client.publish(
        `${topic}/response/${embed_id}`,
        JSON.stringify({
          status: "Invalid",
          message: "Insufficient balance",
          vehicle_number: vehicle.vehicle_number,
          fee: fee,
        })
      );
    }

    await user.update({ balance: user.balance - fee });
    await session.update({
      exit_time,
      status: "completed",
      payment_status: "paid",
      fee,
    });

    await Transaction.create({
      user_id: user.user_id,
      balance: user.balance,
      amount: fee,
      status: "completed",
      payment_method: "rfid_balance",
      transaction_type: "fee",
      session_id: session.session_id,
    });

    await vehicle.update({ status: "exited" });

    client.publish(
      `${topic}/response/${embed_id}`,
      JSON.stringify({
        status: "valid",
        message: "Exit logged",
        vehicle_number: vehicle.vehicle_number,
        fee: fee,
      })
    );
  }

  await TrafficLog.create({
    card_id: card.card_id,
    device_id: device.device_id,
    action: logAction,
    time: new Date(),
  });
}

module.exports = { barrierHandler };

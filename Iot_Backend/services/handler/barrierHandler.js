const Device = require("../../models/deviceModel.js");
const RfidCard = require("../../models/rfidCardModel");
const TrafficLog = require("../../models/trafficLogModel");
const ParkingSession = require("../../models/parkingSessionModel");
const User = require("../../models/userModel");
const Sequelize = require("../../config/database");
const validator = require("validator");
const Vehicle = require("../../models/vehicleModel");
const VehicleType = require("../../models/vehicleTypeModel");
const Transaction = require("../../models/transactionModel");
const { mqttEventEmitter } = require("../eventEmitter");
const { getClient } = require("../mqttClient");
const {
  sendNotification,
} = require("../../controllers/notificationController.js");
const { isParkingFull } = require("../helper/helper.js");
const { Hooks } = require("sequelize/lib/hooks");
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

// Input validation schema
const validateInput = (data, requiredFields) => {
  return requiredFields.every(
    (field) =>
      data[field] &&
      typeof data[field] === "string" &&
      validator.trim(data[field]).length > 0
  );
};

// Shared response publisher
const publishResponse = (
  client,
  topic,
  embed_id,
  status,
  message,
  extra = {}
) => {
  return client.publish(
    `${topic}/response/${embed_id}`,
    JSON.stringify({ status, message, ...extra })
  );
};

// Shared traffic logger
const logTraffic = async ({
  card_id,
  device_id,
  action,
  is_valid,
  details,
  vehicle_number,
  embed_id,
}) => {
  if (device_id && action) {
    const log = await TrafficLog.create({
      card_id,
      device_id,
      action,
      is_valid,
      time: new Date(),
      details,
    });
    mqttEventEmitter.emit("mqttMessage", {
      action: log.action,
      is_valid: log.is_valid,
      details: log.details,
      vehicle_number,
      embed_id,
    });
  }
};

async function barrierHandler2(client, topic, data) {
  const { card_number, embed_id, action } = data;

  let card_id = null;
  let device_id = null;
  let is_valid = false;
  let details = null;

  try {
    if (!card_number || !embed_id || !action) {
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Missing or invalid fields"
      );
    }

    if (!["enter", "exit"].includes(action)) {
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Invalid action"
      );
    }

    const device = await Device.findOne({ where: { embed_id } });
    if (!device) {
      await logTraffic({
        device_id,
        action,
        is_valid,
        details: "Device not found",
      });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Device not found"
      );
    }
    device_id = device.device_id;

    const card = await RfidCard.findOne({
      where: { card_number },
      include: [{ model: User }],
    });

    if (!card || !card.user) {
      await logTraffic({
        device_id,
        action,
        is_valid,
        details: "Card or user not found",
        embed_id,
      });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Card or user not found",
        {
          vehicle_number: "N/A",
        }
      );
    }
    card_id = card.card_id;
    const user = card.user;

    const vehicle = await Vehicle.findOne({
      where: { card_id: card.card_id },
      include: [{ model: VehicleType }],
    });

    if (!vehicle) {
      details = `Vehicle not found for card ${card_number}`;
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        details,
        embed_id,
      });
      return publishResponse(client, topic, embed_id, "invalid", details, {
        vehicle_number: "N/A",
      });
    }

    // Check vehicle status
    if (vehicle.status === "blocked") {
      details = "Vehicle is blocked";
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        details,
        embed_id,
        vehicle_number: vehicle.vehicle_number,
      });
      return publishResponse(client, topic, embed_id, "invalid", details, {
        vehicle_number: vehicle.vehicle_number,
      });
    }

    // Check balance for entry
    if (action === "enter" && user.balance <= 0) {
      sendNotification(user.user_id, "Insufficient balance to park", "warning");
      details = "Insufficient balance";
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        details,
        embed_id,
        vehicle_number: vehicle.vehicle_number,
      });
      return publishResponse(client, topic, embed_id, "invalid", details, {
        vehicle_number: vehicle.vehicle_number,
      });
    }

    // Handle entry
    if (action === "enter") {
      if (vehicle.status !== "exited") {
        details = "Vehicle is already inside";
        await logTraffic({
          card_id,
          device_id,
          action,
          is_valid,
          details,
          embed_id,
          vehicle_number: vehicle.vehicle_number,
        });
        return publishResponse(client, topic, embed_id, "invalid", details, {
          vehicle_number: vehicle.vehicle_number,
        });
      }

      if (await isParkingFull(vehicle.vehicle_type_id)) {
        details = "Parking space full";
        await logTraffic({
          card_id,
          device_id,
          action,
          is_valid,
          details,
          embed_id,
          vehicle_number: vehicle.vehicle_number,
        });
        return publishResponse(client, topic, embed_id, "invalid", details, {
          vehicle_number: vehicle.vehicle_number,
        });
      }

      // Use transaction for data integrity
      await Sequelize.transaction(async (t) => {
        await vehicle.update({ status: "parking" }, { transaction: t });
        await ParkingSession.create(
          {
            vehicle_id: vehicle.vehicle_id,
            entry_time: new Date(),
            status: "active",
          },
          { transaction: t }
        );
      });

      is_valid = true;
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        embed_id,
        vehicle_number: vehicle.vehicle_number,
      });
      return publishResponse(client, topic, embed_id, "valid", "Entry logged", {
        vehicle_number: vehicle.vehicle_number,
      });
    }

    // Handle exit
    const session = await ParkingSession.findOne({
      where: { vehicle_id: vehicle.vehicle_id, status: "active" },
    });

    if (!session) {
      details = "No active parking session found";
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        details,
        embed_id,
        vehicle_number: vehicle.vehicle_number,
      });
      return publishResponse(client, topic, embed_id, "invalid", details, {
        vehicle_number: vehicle.vehicle_number,
      });
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
      details = "Insufficient balance";
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        details,
        embed_id,
        vehicle_number: vehicle.vehicle_number,
      });
      return publishResponse(client, topic, embed_id, "invalid", details, {
        vehicle_number: vehicle.vehicle_number,
        fee,
      });
    }

    await Sequelize.transaction(async (t) => {
      await user.update({ balance: user.balance - fee }, { transaction: t });
      await session.update(
        {
          exit_time,
          status: "completed",
          payment_status: "paid",
          fee,
        },
        { transaction: t }
      );
      await Transaction.create(
        {
          user_id: user.user_id,
          balance: user.balance,
          amount: fee,
          status: "completed",
          payment_method: "rfid_balance",
          transaction_type: "fee",
          session_id: session.session_id,
          device_id,
        },
        { transaction: t }
      );
      await vehicle.update(
        { status: "exited" },
        { transaction: t, hooks: false }
      );
    });

    is_valid = true;
    await logTraffic({
      card_id,
      device_id,
      action,
      is_valid,
      embed_id,
      vehicle_number: vehicle.vehicle_number,
    });
    return publishResponse(client, topic, embed_id, "valid", "Exit logged", {
      vehicle_number: vehicle.vehicle_number,
      fee,
    });
  } catch (error) {
    console.error("Barrier handler error:", error);
    details = `System error: ${error.message}`;
    await logTraffic({
      card_id,
      device_id,
      action,
      is_valid,
      embed_id,
      details,
    });
    return publishResponse(client, topic, embed_id, "error", "System error");
  }
}

// Cash payment handler
async function cashConfirm(client, data) {
  const { vehicle_number, embed_id, fee } = data;
  let device_id = null;

  try {
    // Validate input
    if (!embed_id) {
      return console.error("Missing embed_id");
    }
    const topic = `barrier/exit`;
    if (!vehicle_number || !fee) {
      // await logTraffic({ device_id, action: 'exit-cash', is_valid: false, details: 'Missing or invalid fields' });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Missing or invalid fields"
      );
    }

    // Find device
    const device = await Device.findOne({ where: { embed_id } });
    if (!device) {
      // await logTraffic({ device_id, action: 'exit-cash', is_valid: false, details: 'Device not found' });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Device not found"
      );
    }
    device_id = device.device_id;

    // Find vehicle
    const vehicle = await Vehicle.findOne({ where: { vehicle_number } });
    if (!vehicle) {
      await logTraffic({
        device_id,
        action: "exit-cash",
        is_valid: false,
        details: "Vehicle not found",
        embed_id,
        vehicle_number,
      });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Vehicle not found"
      );
    }
    // Find session
    const session = await ParkingSession.findOne({
      where: { vehicle_id: vehicle.vehicle_id, status: "active" },
    });
    if (!session) {
      await logTraffic({
        device_id,
        action: "exit-cash",
        is_valid: false,
        details: "No active parking session",
        embed_id,
        vehicle_number,
      });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "No active parking session found",
        {
          vehicle_number: vehicle.vehicle_number,
        }
      );
    }

    // Verify fee
    const exit_time = new Date();
    const calculatedFee = await calculateFee(
      session.entry_time,
      exit_time,
      vehicle.vehicle_type_id
    );
    if (calculatedFee !== parseFloat(fee)) {
      await logTraffic({
        device_id,
        action: "exit-cash",
        is_valid: false,
        details: "Fee mismatch",
        embed_id,
        vehicle_number,
      });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "Fee mismatch",
        {
          vehicle_number: vehicle.vehicle_number,
          fee: calculatedFee,
        }
      );
    }

    // Find user
    const user = await User.findOne({ where: { user_id: vehicle.user_id } });
    if (!user) {
      await logTraffic({
        device_id,
        action: "exit-cash",
        is_valid: false,
        details: "User not found",
        embed_id,
        vehicle_number,
      });
      return publishResponse(
        client,
        topic,
        embed_id,
        "invalid",
        "User not found"
      );
    }

    // Use transaction for data integrity
    await Sequelize.transaction(async (t) => {
      await session.update(
        {
          exit_time,
          status: "completed",
          payment_status: "paid",
          fee,
        },
        { transaction: t }
      );
      await vehicle.update(
        { status: "exited" },
        { transaction: t, hooks: false }
      );
      await Transaction.create(
        {
          user_id: user.user_id,
          balance: user.balance,
          amount: fee,
          status: "completed",
          payment_method: "cash",
          transaction_type: "fee",
          session_id: session.session_id,
          device_id,
        },
        { transaction: t }
      );
    });

    await logTraffic({
      device_id,
      action: "exit-cash",
      card_id: vehicle.card_id,
      is_valid: true,
      embed_id,
      vehicle_number,
    });
    publishResponse(
      client,
      topic,
      embed_id,
      "valid",
      "Cash payment confirmed",
      {
        vehicle_number: vehicle.vehicle_number,
        fee,
        payment_method: "cash",
      }
    );

    sendNotification(
      user.user_id,
      `Cash payment of ${fee} received for vehicle ${vehicle.vehicle_number}`,
      "info"
    );
  } catch (error) {
    console.error("Cash confirm error:", error);
    await logTraffic({
      device_id,
      action: "exit-cash",
      is_valid: false,
      details: `System error: ${error.message}`,
    });
    return publishResponse(client, topic, embed_id, "error", "System error");
  }
}

module.exports = { barrierHandler2, cashConfirm };
// module.exports = { barrierHandler, cashConfirm, barrierHandler2 };

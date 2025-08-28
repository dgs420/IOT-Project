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
const { getClient } = require("../../config/mqttClient.js");
const calculateFee = require("../../utils/calculateFee");
const {
  createAndSendNotification,
} = require("../../services/notificationService");
const { createPaymentLink } = require("../../services/paymentService");
const { isParkingFull } = require("../helper/helper.js");
const { Hooks } = require("sequelize/lib/hooks");
// const EventEmitter = require("events");
// const client  = getClient ();
// async function calculateFee(entryTime, exitTime, vehicleTypeId) {
//   if (exitTime <= entryTime) {
//     throw new Error("Exit time must be after entry time");
//   }
//   const vehicleType = await VehicleType.findByPk(vehicleTypeId);

//   if (!vehicleType) {
//     throw new Error("Vehicle type not found");
//   }

//   const ratePerHour = vehicleType.fee_per_hour;
//   const durationMs = exitTime - entryTime;
//   const durationMinutes = Math.ceil(durationMs / (1000 * 60));
//   const ratePerMinute = ratePerHour / 60;
//   const finalFee = durationMinutes * ratePerHour;
//   // const finalFee = Math.round(baseFee * Math.pow(10, 2)) / Math.pow(10, 2);
//   console.log("durationMinutes", durationMinutes, "ratePerMinute",ratePerMinute, "finalFee", finalFee);
//   return finalFee;
// }
// Input validation schema
const validateInput = (data, requiredFields) => {
  return requiredFields.every(
    (field) =>
      data[field] &&
      typeof data[field] === "string" &&
      validator.trim(data[field]).length > 0
  );
};

const publishResponse = ({
  topic,
  embed_id,
  status,
  message,
  is_guest = false,
  extra = {},
}) => {
  const client = getClient();
  return client.publish(
    `barrier/${topic}/response/${embed_id}`,
    JSON.stringify({ status, message, is_guest, ...extra })
  );
};

// Shared traffic logger
const logTraffic = async ({
  card_id,
  device_id,
  action,
  is_valid,
  details,
  vehicle_plate,
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
      vehicle_plate,
      embed_id,
    });
  }
};

async function handleCardScan(topic, data) {
  const { card_number, embed_id, action, vehicle_plate, vehicle_type } = data;

  let card_id = null;
  let device_id = null;
  let is_valid = false;
  let details = null;
  const isEnter = action === "enter";
  try {
    if (!card_number || !embed_id || !action) {
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Missing or invalid fields",
      });
    }

    if (!["enter", "exit"].includes(action)) {
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Invalid action",
      });
    }

    const device = await Device.findOne({ where: { embed_id } });
    if (!device) {
      await logTraffic({
        device_id,
        action,
        is_valid,
        details: "Device not found",
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Device not found",
      });
    }
    device_id = device.device_id;

    const card = await RfidCard.findOne({
      where: { card_number },
      include: [{ model: User }],
    });
    if (!card) {
      await logTraffic({
        device_id,
        action,
        is_valid,
        details: "Card not found",
        embed_id,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Card not found",
        extra: {
          vehicle_plate: "",
          ...(isEnter ? {} : { fee: 0, need_payment: false }),
        },
      });
    }
    card_id = card.card_id;
    if (card.is_guest) {
      if (isEnter) {
        // Validate guest entry requirements
        if (!validateInput(data, ["vehicle_plate", "vehicle_type"])) {
          await logTraffic({
            card_id,
            device_id,
            action,
            is_valid,
            details: "Missing vehicle plate or type for guest entry",
            embed_id,
          });
          return publishResponse({
            topic,
            embed_id,
            status: "invalid",
            message: "Missing vehicle plate or type for guest entry",
            is_guest: true,
            extra: { vehicle_plate: "" },
          });
        }

        const vehicleType = await VehicleType.findOne({
          where: { vehicle_type_name: vehicle_type },
        });
        if (!vehicleType) {
          await logTraffic({
            card_id,
            device_id,
            action,
            is_valid,
            details: "Invalid vehicle type",
            embed_id,
            vehicle_plate,
          });
          return publishResponse({
            topic,
            embed_id,
            status: "invalid",
            message: "Invalid vehicle type",
            is_guest: true,
            extra: { vehicle_plate },
          });
        }

        // Check for existing active guest session
        const existingSession = await ParkingSession.findOne({
          where: {
            card_id: card.card_id,
            status: "active",
            is_guest: true,
          },
        });
        if (existingSession) {
          await logTraffic({
            card_id,
            device_id,
            action,
            is_valid,
            details: "Active guest session already exists",
            embed_id,
            vehicle_plate,
          });
          return publishResponse({
            topic,
            embed_id,
            status: "invalid",
            message: "Active guest session already exists",
            is_guest: true,
            extra: { vehicle_plate: existingSession.vehicle_plate },
          });
        }

        // Check parking availability
        if (await isParkingFull(vehicleType.vehicle_type_id)) {
          await logTraffic({
            card_id,
            device_id,
            action,
            is_valid,
            details: "Parking space full",
            embed_id,
            vehicle_plate,
          });
          return publishResponse({
            topic,
            embed_id,
            status: "invalid",
            message: "Parking space full",
            is_guest: true,
            extra: { vehicle_plate },
          });
        }

        // Create new guest parking session
        await Sequelize.transaction(async (t) => {
          await ParkingSession.create(
            {
              card_id: card.card_id,
              vehicle_plate,
              vehicle_type_id: vehicleType.vehicle_type_id,
              entry_time: new Date(),
              status: "active",
              is_guest: true,
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
          vehicle_plate,
        });
        return publishResponse({
          topic,
          embed_id,
          status: "valid",
          message: "Guest entry logged",
          is_guest: true,
          extra: {
            vehicle_plate,
          },
        });
      } else {
        // Handle guest exit
        const session = await ParkingSession.findOne({
          where: {
            card_id: card.card_id,
            status: "active",
            is_guest: true,
          },
        });

        if (!session) {
          await logTraffic({
            card_id: card.card_id,
            device_id,
            action,
            is_valid,
            details: "No active guest parking session found",
            embed_id,
            vehicle_plate: vehicle_plate || "",
          });
          console.log("card_id", card.card_id);
          return publishResponse({
            topic,
            embed_id,
            status: "invalid",
            message: "No active guest parking session found",
            is_guest: true,
            extra: {
              vehicle_plate: vehicle_plate || "",
              fee: 0,
              need_payment: false,
            },
          });
        }

        const exit_time = new Date();
        const fee = await calculateFee(
          session.entry_time,
          exit_time,
          session.vehicle_type_id
        );
        // const paymentLink = await createPaymentLink({
        //   user_id: "guest",
        //   amount: fee,
        //   currency: "usd",
        //   session_id: session.session_id,
        //   embed_id,
        //   vehicle_plate,
        // });

        is_valid = true;
        await logTraffic({
          card_id,
          device_id,
          action,
          is_valid,
          details: `Guest exit fee calculated: ${fee}`,
          embed_id,
          vehicle_plate: session.vehicle_plate,
        });
        return publishResponse({
          topic,
          embed_id,
          status: "pending",
          message: "Guest exit fee calculated",
          is_guest: true,
          extra: {
            vehicle_plate: session.vehicle_plate,
            fee,
            session_id: session.session_id,
            need_payment: true,
            // payment_link: paymentLink.url,
          },
        });
      }
    }
    //Registered user
    if (!card.user) {
      await logTraffic({
        device_id,
        action,
        is_valid,
        details: "User not found for this card",
        embed_id,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "User not found for this card",
        extra: {
          vehicle_plate: "",
          ...(isEnter ? {} : { fee: 0, need_payment: false }),
        },
      });
    }
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
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: details,
        extra: {
          vehicle_plate: "",
          ...(isEnter ? {} : { fee: 0, need_payment: false }),
        },
      });
    }

    if (vehicle.status === "blocked") {
      details = "Vehicle is blocked";
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid,
        details,
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: details,
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
          ...(isEnter ? {} : { need_payment: false }),
        },
      });
    }

    if (isEnter && user.balance <= 0) {
      createAndSendNotification(
        user.user_id,
        "Insufficient balance to park",
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
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: details,
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
        },
      });
    }

    // Handle entry
    if (isEnter) {
      if (vehicle.status !== "exited") {
        details = "Vehicle is already inside";
        await logTraffic({
          card_id,
          device_id,
          action,
          is_valid,
          details,
          embed_id,
          vehicle_plate: vehicle.vehicle_plate,
        });
        return publishResponse({
          topic,
          embed_id,
          status: "invalid",
          message: details,
          extra: {
            vehicle_plate: vehicle.vehicle_plate,
          },
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
          vehicle_plate: vehicle.vehicle_plate,
        });
        return publishResponse({
          topic,
          embed_id,
          status: "invalid",
          message: details,
          extra: {
            vehicle_plate: vehicle.vehicle_plate,
          },
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
            vehicle_type_id: vehicle.vehicle_type_id,
            vehicle_plate: vehicle.vehicle_plate,
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
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "valid",
        message: "Entry logged",
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
        },
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
        vehicle_plate: vehicle.vehicle_plate,
        session_id: null,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: details,
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
          fee: 0,
          need_payment: false,
        },
      });
    }

    const exit_time = new Date();
    const fee = await calculateFee(
      session.entry_time,
      exit_time,
      vehicle.vehicle_type_id
    );

    if (user.balance < fee) {
      // const paymentLink = await createPaymentLink({
      //   user_id: user.user_id || "guest",
      //   amount: fee,
      //   currency: "usd",
      //   session_id: session.session_id,
      //   embed_id,
      //   vehicle_plate:  vehicle.vehicle_plate,
      // });

     
      createAndSendNotification(
        user.user_id,
        `Insufficient balance for exit fee of $${fee} for vehicle ${vehicle.vehicle_plate}`,
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
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: details,
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
          fee,
          session_id: session.session_id,
          need_payment: true,
          // payment_link: paymentLink.url,
          // payment_link_id: paymentLink.payment_link_id,
        },
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
      vehicle_plate: vehicle.vehicle_plate,
    });
    return publishResponse({
      topic,
      embed_id,
      status: "valid",
      message: "Exit logged",
      extra: {
        vehicle_plate: vehicle.vehicle_plate,
        fee,
        session_id: session.session_id,
        need_payment: false,
      },
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
    return publishResponse({
      topic,
      embed_id,
      status: "error",
      message: "System error",
      need_payment: false,
    });
  }
}

async function cashConfirm(data) {
  const { vehicle_plate, embed_id, fee, is_guest } = data;
  let device_id = null;

  try {
    if (!embed_id) {
      return console.error("Missing embed_id");
    }
    const topic = `exit`;
    if (!vehicle_plate || !fee) {
      // await logTraffic({ device_id, action: 'exit-cash', is_valid: false, details: 'Missing or invalid fields' });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Missing or invalid fields",
        extra: {
          need_payment: false,
        },
      });
    }

    const device = await Device.findOne({ where: { embed_id } });
    if (!device) {
      // await logTraffic({ device_id, action: 'exit-cash', is_valid: false, details: 'Device not found' });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Device not found",
        extra: {
          need_payment: false,
        },
      });
    }
    // if (device.status === "offline") {
    //   await logTraffic({ device_id, action: 'exit-cash', is_valid: false, details: 'Device is offline' });
    //   return publishResponse(topic, embed_id, "invalid", "Device is offline");
    // }

    device_id = device.device_id;
    if (is_guest) {
      const session = await ParkingSession.findOne({
        where: { vehicle_plate, status: "active", is_guest: true },
      });

      if (!session) {
        await logTraffic({
          device_id,
          action: "exit-cash",
          is_valid: false,
          details: "No active guest parking session found",
          embed_id,
          vehicle_plate,
          extra: {
            need_payment: false,
          },
        });
        return publishResponse({
          topic,
          embed_id,
          status: "invalid",
          message: "No active guest parking session found",
          extra: { vehicle_plate, need_payment: false },
        });
      }

      if (session.vehicle_plate !== vehicle_plate) {
        await logTraffic({
          device_id,
          card_id: session.card_id,
          action: "exit-cash",
          is_valid: false,
          details: "Vehicle plate mismatch",
          embed_id,
          vehicle_plate,
        });
        return publishResponse({
          topic,
          embed_id,
          status: "invalid",
          message: "Vehicle plate mismatch",
          extra: { vehicle_plate, need_payment: false },
        });
      }

      const vehicleType = await VehicleType.findByPk(session.vehicle_type_id);
      const exit_time = new Date();
      const calculatedFee = await calculateFee(
        session.entry_time,
        exit_time,
        session.vehicle_type_id
      );

      const feeNumber = parseFloat(fee);
      const difference = Math.abs(calculatedFee - feeNumber);
      const maxAllowedDifference = Math.max(
        0.08 * vehicleType.fee_per_hour,
        0.05
      );

      if (difference > maxAllowedDifference) {
        await logTraffic({
          device_id,
          card_id: session.card_id,
          action: "exit-cash",
          is_valid: false,
          details: "Fee mismatch",
          embed_id,
          vehicle_plate,
        });
        return publishResponse({
          topic,
          embed_id,
          status: "invalid",
          message: "Fee mismatch",
          extra: {
            vehicle_plate,
            fee: calculatedFee,
            need_payment: true,
          },
        });
      }

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
        await Transaction.create(
          {
            user_id: null,
            balance: 0,
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
        card_id: session.card_id,
        action: "exit-cash",
        is_valid: true,
        embed_id,
        vehicle_plate,
      });
      publishResponse({
        topic,
        embed_id,
        status: "valid",
        message: "Guest cash payment confirmed",
        extra: {
          vehicle_plate,
          fee,
          payment_method: "cash",
          need_payment: false,
        },
      });

      // createAndSendNotification(
      //   null,
      //   `Cash payment of ${fee} received for guest vehicle ${vehicle_plate}`,
      //   "info"
      // );
      return;
    }
    const vehicle = await Vehicle.findOne({ where: { vehicle_plate } });
    if (!vehicle) {
      await logTraffic({
        device_id,
        action: "exit-cash",
        is_valid: false,
        details: "Vehicle not found",
        embed_id,
        vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Vehicle not found",
        extra: { vehicle_plate, need_payment: false },
      });
    }
    // Find session
    const session = await ParkingSession.findOne({
      where: { vehicle_id: vehicle.vehicle_id, status: "active" },
    });
    if (!session) {
      await logTraffic({
        device_id,
        card_id: vehicle.card_id,
        action: "exit-cash",
        is_valid: false,
        details: "No active parking session",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "No active parking session found",
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
          need_payment: false,
        },
      });
    }

    const vehicleType = await VehicleType.findByPk(vehicle.vehicle_type_id);

    const exit_time = new Date();
    const calculatedFee = await calculateFee(
      session.entry_time,
      exit_time,
      vehicle.vehicle_type_id
    );

    const feeNumber = parseFloat(fee);
    const difference = Math.abs(calculatedFee - feeNumber);
    //allow 8% of hourly fee or approximately 5 minutes margin
    const maxAllowedDifference = Math.max(
      0.08 * vehicleType.fee_per_hour,
      0.05 // Minimum 5 cents tolerance for very cheap rates
    );

    const isFeeValid = difference <= maxAllowedDifference;

    if (!isFeeValid) {
      await logTraffic({
        device_id,
        card_id: vehicle.card_id,
        action: "exit-cash",
        is_valid: false,
        details: "Fee mismatch",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      console.log(
        `Fee mismatch: ${calculatedFee} vs ${fee} for vehicle ${vehicle.vehicle_plate}`
      );
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "Fee mismatch",
        extra: {
          vehicle_plate: vehicle.vehicle_plate,
          fee: calculatedFee,
          need_payment: true,
        },
      });
    }

    // Find user
    const user = await User.findOne({ where: { user_id: vehicle.user_id } });
    if (!user) {
      await logTraffic({
        device_id,
        card_id: vehicle.card_id,
        action: "exit-cash",
        is_valid: false,
        details: "User not found",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse({
        topic,
        embed_id,
        status: "invalid",
        message: "User not found",
        extra: { vehicle_plate: vehicle.vehicle_plate, need_payment: false },
      });
    }

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
      vehicle_plate,
    });
    publishResponse({
      topic,
      embed_id,
      status: "valid",
      message: "Cash payment confirmed",
      extra: {
        vehicle_plate: vehicle.vehicle_plate,
        fee,
        need_payment: false,
        payment_method: "cash",
      },
    });
    createAndSendNotification(
      user.user_id,
      `Cash payment of ${fee} received for vehicle ${vehicle.vehicle_plate}`,
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
    return publishResponse({
      topic: "exit",
      embed_id,
      status: "error",
      message: "System error",
      extra: { vehicle_plate, need_payment: false },
    });
    // return publishResponse(topic, embed_id, "error", "System error");
  }
}

module.exports = { handleCardScan, cashConfirm };
// module.exports = { barrierHandler, cashConfirm, barrierHandler2 };

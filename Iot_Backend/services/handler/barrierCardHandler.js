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
const { createAndSendNotification } = require("../../services/notificationService");
const { isParkingFull } = require("../helper/helper.js");

// Enums for constants
const ActionTypes = {
  ENTER: "enter",
  EXIT: "exit",
  EXIT_CASH: "exit-cash",
};

const ResponseStatuses = {
  VALID: "valid",
  INVALID: "invalid",
  PENDING: "pending",
  ERROR: "error",
};

// Input validation schema
const validateInput = (data, requiredFields) => {
  return requiredFields.every(
    (field) =>
      data[field] &&
      typeof data[field] === "string" &&
      validator.trim(data[field]).length > 0
  );
};

// Response builder
const buildResponse = ({
  topic,
  embed_id,
  status,
  message,
  is_guest = false,
  extra = {},
}) => ({
  topic,
  embed_id,
  status,
  message,
  is_guest,
  extra,
});

// Publish response
const publishResponse = ({ topic, embed_id, status, message, is_guest = false, extra = {} }) => {
  const client = getClient();
  return client.publish(
    `barrier/${topic}/response/${embed_id}`,
    JSON.stringify({ status, message, is_guest, ...extra })
  );
};

// Shared traffic logger
const logTraffic = async ({ card_id, device_id, action, is_valid, details, vehicle_plate, embed_id }) => {
  if (!device_id || !action) return;
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
};

// Database service methods
const DeviceService = {
  findByEmbedId: async (embed_id) => Device.findOne({ where: { embed_id } }),
};

const CardService = {
  findByNumber: async (card_number) =>
    RfidCard.findOne({
      where: { card_number },
      include: [{ model: User }],
    }),
};

const VehicleService = {
  findByCardId: async (card_id) =>
    Vehicle.findOne({
      where: { card_id },
      include: [{ model: VehicleType }],
    }),
};

const SessionService = {
  findActiveGuestSession: async (card_id) =>
    ParkingSession.findOne({
      where: { card_id, status: "active", is_guest: true },
    }),
  findActiveSessionByVehicleId: async (vehicle_id) =>
    ParkingSession.findOne({
      where: { vehicle_id, status: "active" },
    }),
  createGuestSession: async (card_id, vehicle_plate, vehicle_type_id, transaction) =>
    ParkingSession.create(
      {
        card_id,
        vehicle_plate,
        vehicle_type_id,
        entry_time: new Date(),
        status: "active",
        is_guest: true,
      },
      { transaction }
    ),
  createSession: async (vehicle_id, vehicle_type_id, vehicle_plate, transaction) =>
    ParkingSession.create(
      {
        vehicle_id,
        entry_time: new Date(),
        status: "active",
        vehicle_type_id,
        vehicle_plate,
      },
      { transaction }
    ),
};

const TransactionService = {
  create: async ({ user_id, balance, amount, session_id, device_id, payment_method }, transaction) =>
    Transaction.create(
      {
        user_id,
        balance,
        amount,
        status: "completed",
        payment_method,
        transaction_type: "fee",
        session_id,
        device_id,
      },
      { transaction }
    ),
};

// Handle guest entry
async function handleGuestEntry({ topic, embed_id, data, device_id }) {
  const { vehicle_plate, vehicle_type } = data;

  if (!validateInput(data, ["vehicle_plate", "vehicle_type"])) {
    await logTraffic({
      device_id,
      action: ActionTypes.ENTER,
      is_valid: false,
      details: "Missing vehicle plate or type for guest entry",
      embed_id,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
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
      device_id,
      action: ActionTypes.ENTER,
      is_valid: false,
      details: "Invalid vehicle type",
      embed_id,
      vehicle_plate,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "Invalid vehicle type",
      is_guest: true,
      extra: { vehicle_plate },
    });
  }

  if (await isParkingFull(vehicleType.vehicle_type_id)) {
    await logTraffic({
      device_id,
      action: ActionTypes.ENTER,
      is_valid: false,
      details: "Parking space full",
      embed_id,
      vehicle_plate,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "Parking space full",
      is_guest: true,
      extra: { vehicle_plate },
    });
  }

  return null; // Continue to session creation
}

// Handle guest exit
async function handleGuestExit({ topic, embed_id, card_id, device_id, vehicle_plate }) {
  const session = await SessionService.findActiveGuestSession(card_id);
  if (!session) {
    await logTraffic({
      card_id,
      device_id,
      action: ActionTypes.EXIT,
      is_valid: false,
      details: "No active guest parking session found",
      embed_id,
      vehicle_plate: vehicle_plate || "",
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
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
  const fee = await calculateFee(session.entry_time, exit_time, session.vehicle_type_id);

  await logTraffic({
    card_id,
    device_id,
    action: ActionTypes.EXIT,
    is_valid: true,
    details: `Guest exit fee calculated: ${fee}`,
    embed_id,
    vehicle_plate: session.vehicle_plate,
  });

  return buildResponse({
    topic,
    embed_id,
    status: ResponseStatuses.PENDING,
    message: "Guest exit fee calculated",
    is_guest: true,
    extra: {
      vehicle_plate: session.vehicle_plate,
      fee,
      session_id: session.session_id,
      need_payment: true,
    },
  });
}

// Handle registered user entry
async function handleRegisteredEntry({ topic, embed_id, card_id, device_id, user, vehicle }) {
  if (user.balance <= 0) {
    createAndSendNotification(user.user_id, "Insufficient balance to park", "warning");
    await logTraffic({
      card_id,
      device_id,
      action: ActionTypes.ENTER,
      is_valid: false,
      details: "Insufficient balance",
      embed_id,
      vehicle_plate: vehicle.vehicle_plate,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "Insufficient balance",
      extra: { vehicle_plate: vehicle.vehicle_plate },
    });
  }

  if (vehicle.status !== "exited") {
    await logTraffic({
      card_id,
      device_id,
      action: ActionTypes.ENTER,
      is_valid: false,
      details: "Vehicle is already inside",
      embed_id,
      vehicle_plate: vehicle.vehicle_plate,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "Vehicle is already inside",
      extra: { vehicle_plate: vehicle.vehicle_plate },
    });
  }

  if (await isParkingFull(vehicle.vehicle_type_id)) {
    await logTraffic({
      card_id,
      device_id,
      action: ActionTypes.ENTER,
      is_valid: false,
      details: "Parking space full",
      embed_id,
      vehicle_plate: vehicle.vehicle_plate,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "Parking space full",
      extra: { vehicle_plate: vehicle.vehicle_plate },
    });
  }

  return null; // Continue to session creation
}

// Handle registered user exit
async function handleRegisteredExit({ topic, embed_id, card_id, device_id, user, vehicle }) {
  const session = await SessionService.findActiveSessionByVehicleId(vehicle.vehicle_id);
  if (!session) {
    await logTraffic({
      card_id,
      device_id,
      action: ActionTypes.EXIT,
      is_valid: false,
      details: "No active parking session found",
      embed_id,
      vehicle_plate: vehicle.vehicle_plate,
      session_id: null,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "No active parking session found",
      extra: {
        vehicle_plate: vehicle.vehicle_plate,
        fee: 0,
        need_payment: false,
      },
    });
  }

  const exit_time = new Date();
  const fee = await calculateFee(session.entry_time, exit_time, vehicle.vehicle_type_id);

  if (user.balance < fee) {
    createAndSendNotification(
      user.user_id,
      `Insufficient balance for exit fee of $${fee} for vehicle ${vehicle.vehicle_plate}`,
      "warning"
    );
    await logTraffic({
      card_id,
      device_id,
      action: ActionTypes.EXIT,
      is_valid: false,
      details: "Insufficient balance",
      embed_id,
      vehicle_plate: vehicle.vehicle_plate,
    });
    return buildResponse({
      topic,
      embed_id,
      status: ResponseStatuses.INVALID,
      message: "Insufficient balance",
      extra: {
        vehicle_plate: vehicle.vehicle_plate,
        fee,
        session_id: session.session_id,
        need_payment: true,
      },
    });
  }

  return { session, fee, exit_time }; // Continue to transaction
}

async function handleCardScan(topic, data) {
  const { card_number, embed_id, action, vehicle_plate, vehicle_type } = data;

  try {
    // Validate input
    if (!card_number || !embed_id || !action) {
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Missing or invalid fields",
        })
      );
    }

    if (![ActionTypes.ENTER, ActionTypes.EXIT].includes(action)) {
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Invalid action",
        })
      );
    }

    // Validate device
    const device = await DeviceService.findByEmbedId(embed_id);
    if (!device) {
      await logTraffic({
        action,
        is_valid: false,
        details: "Device not found",
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Device not found",
        })
      );
    }
    const device_id = device.device_id;

    // Validate card
    const card = await CardService.findByNumber(card_number);
    if (!card) {
      await logTraffic({
        device_id,
        action,
        is_valid: false,
        details: "Card not found",
        embed_id,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Card not found",
          extra: {
            vehicle_plate: "",
            ...(action === ActionTypes.EXIT ? { fee: 0, need_payment: false } : {}),
          },
        })
      );
    }
    const card_id = card.card_id;

    // Handle guest
    if (card.is_guest) {
      if (action === ActionTypes.ENTER) {
        const guestEntryResponse = await handleGuestEntry({ topic, embed_id, data, device_id });
        if (guestEntryResponse) return publishResponse(guestEntryResponse);

        const vehicleType = await VehicleType.findOne({ where: { vehicle_type_name: vehicle_type } });
        await Sequelize.transaction(async (t) => {
          await SessionService.createGuestSession(card_id, vehicle_plate, vehicleType.vehicle_type_id, t);
        });

        await logTraffic({
          card_id,
          device_id,
          action,
          is_valid: true,
          embed_id,
          vehicle_plate,
        });
        return publishResponse(
          buildResponse({
            topic,
            embed_id,
            status: ResponseStatuses.VALID,
            message: "Guest entry logged",
            is_guest: true,
            extra: { vehicle_plate },
          })
        );
      } else {
        const guestExitResponse = await handleGuestExit({
          topic,
          embed_id,
          card_id,
          device_id,
          vehicle_plate,
        });
        return publishResponse(guestExitResponse);
      }
    }

    // Handle registered user
    if (!card.user) {
      await logTraffic({
        device_id,
        action,
        is_valid: false,
        details: "User not found for this card",
        embed_id,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "User not found for this card",
          extra: {
            vehicle_plate: "",
            ...(action === ActionTypes.EXIT ? { fee: 0, need_payment: false } : {}),
          },
        })
      );
    }
    const user = card.user;

    const vehicle = await VehicleService.findByCardId(card_id);
    if (!vehicle) {
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid: false,
        details: `Vehicle not found for card ${card_number}`,
        embed_id,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: `Vehicle not found for card ${card_number}`,
          extra: {
            vehicle_plate: "",
            ...(action === ActionTypes.EXIT ? { fee: 0, need_payment: false } : {}),
          },
        })
      );
    }

    if (vehicle.status === "blocked") {
      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid: false,
        details: "Vehicle is blocked",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Vehicle is blocked",
          extra: {
            vehicle_plate: vehicle.vehicle_plate,
            ...(action === ActionTypes.EXIT ? { need_payment: false } : {}),
          },
        })
      );
    }

    if (action === ActionTypes.ENTER) {
      const entryResponse = await handleRegisteredEntry({
        topic,
        embed_id,
        card_id,
        device_id,
        user,
        vehicle,
      });
      if (entryResponse) return publishResponse(entryResponse);

      await Sequelize.transaction(async (t) => {
        await vehicle.update({ status: "parking" }, { transaction: t });
        await SessionService.createSession(
          vehicle.vehicle_id,
          vehicle.vehicle_type_id,
          vehicle.vehicle_plate,
          t
        );
      });

      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid: true,
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.VALID,
          message: "Entry logged",
          extra: { vehicle_plate: vehicle.vehicle_plate },
        })
      );
    }

    const exitResponse = await handleRegisteredExit({
      topic,
      embed_id,
      card_id,
      device_id,
      user,
      vehicle,
    });
    if (exitResponse.session) {
      const { session, fee, exit_time } = exitResponse;
      await Sequelize.transaction(async (t) => {
        await user.update({ balance: user.balance - fee }, { transaction: t });
        await session.update(
          { exit_time, status: "completed", payment_status: "paid", fee },
          { transaction: t }
        );
        await TransactionService.create(
          {
            user_id: user.user_id,
            balance: user.balance,
            amount: fee,
            session_id: session.session_id,
            device_id,
            payment_method: "rfid_balance",
          },
          t
        );
        await vehicle.update({ status: "exited" }, { transaction: t, hooks: false });
      });

      await logTraffic({
        card_id,
        device_id,
        action,
        is_valid: true,
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.VALID,
          message: "Exit logged",
          extra: {
            vehicle_plate: vehicle.vehicle_plate,
            fee,
            session_id: session.session_id,
            need_payment: false,
          },
        })
      );
    }
    return publishResponse(exitResponse);
  } catch (error) {
    console.error("Barrier handler error:", error);
    await logTraffic({
      card_id,
      device_id,
      action,
      is_valid: false,
      details: `System error: ${error.message}`,
      embed_id,
    });
    return publishResponse(
      buildResponse({
        topic,
        embed_id,
        status: ResponseStatuses.ERROR,
        message: "System error",
        extra: {
          ...(action === ActionTypes.ENTER ? {} : { need_payment: false }),
        },
      })
    );
  }
}

async function cashConfirm(data) {
  const { vehicle_plate, embed_id, fee, is_guest } = data;
  let device_id = null;

  try {
    if (!embed_id) {
      console.error("Missing embed_id");
      return publishResponse(
        buildResponse({
          topic: ActionTypes.EXIT,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Missing or invalid fields",
          extra: { need_payment: false },
        })
      );
    }
    const topic = ActionTypes.EXIT;

    if (!vehicle_plate || !fee) {
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Missing or invalid fields",
          extra: { need_payment: false },
        })
      );
    }

    const device = await DeviceService.findByEmbedId(embed_id);
    if (!device) {
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Device not found",
          extra: { need_payment: false },
        })
      );
    }
    device_id = device.device_id;

    if (is_guest) {
      const session = await SessionService.findActiveGuestSessionByPlate(vehicle_plate);
      if (!session) {
        await logTraffic({
          device_id,
          action: ActionTypes.EXIT_CASH,
          is_valid: false,
          details: "No active guest parking session found",
          embed_id,
          vehicle_plate,
        });
        return publishResponse(
          buildResponse({
            topic,
            embed_id,
            status: ResponseStatuses.INVALID,
            message: "No active guest parking session found",
            extra: { vehicle_plate, need_payment: false },
          })
        );
      }

      if (session.vehicle_plate !== vehicle_plate) {
        await logTraffic({
          device_id,
          card_id: session.card_id,
          action: ActionTypes.EXIT_CASH,
          is_valid: false,
          details: "Vehicle plate mismatch",
          embed_id,
          vehicle_plate,
        });
        return publishResponse(
          buildResponse({
            topic,
            embed_id,
            status: ResponseStatuses.INVALID,
            message: "Vehicle plate mismatch",
            extra: { vehicle_plate, need_payment: false },
          })
        );
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
      const maxAllowedDifference = Math.max(0.08 * vehicleType.fee_per_hour, 0.05);

      if (difference > maxAllowedDifference) {
        await logTraffic({
          device_id,
          card_id: session.card_id,
          action: ActionTypes.EXIT_CASH,
          is_valid: false,
          details: "Fee mismatch",
          embed_id,
          vehicle_plate,
        });
        return publishResponse(
          buildResponse({
            topic,
            embed_id,
            status: ResponseStatuses.INVALID,
            message: "Fee mismatch",
            extra: { vehicle_plate, fee: calculatedFee, need_payment: false },
          })
        );
      }

      await Sequelize.transaction(async (t) => {
        await session.update(
          { exit_time, status: "completed", payment_status: "paid", fee },
          { transaction: t }
        );
        await TransactionService.create(
          {
            user_id: null,
            balance: 0,
            amount: fee,
            session_id: session.session_id,
            device_id,
            payment_method: "cash",
          },
          t
        );
      });

      await logTraffic({
        device_id,
        card_id: session.card_id,
        action: ActionTypes.EXIT_CASH,
        is_valid: true,
        embed_id,
        vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.VALID,
          message: "Guest cash payment confirmed",
          extra: { vehicle_plate, fee, payment_method: "cash", need_payment: false },
        })
      );
    }

    const vehicle = await Vehicle.findOne({ where: { vehicle_plate } });
    if (!vehicle) {
      await logTraffic({
        device_id,
        action: ActionTypes.EXIT_CASH,
        is_valid: false,
        details: "Vehicle not found",
        embed_id,
        vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Vehicle not found",
          extra: { vehicle_plate, need_payment: false },
        })
      );
    }

    const session = await SessionService.findActiveSessionByVehicleId(vehicle.vehicle_id);
    if (!session) {
      await logTraffic({
        device_id,
        card_id: vehicle.card_id,
        action: ActionTypes.EXIT_CASH,
        is_valid: false,
        details: "No active parking session",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "No active parking session found",
          extra: { vehicle_plate: vehicle.vehicle_plate, need_payment: false },
        })
      );
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
    const maxAllowedDifference = Math.max(0.08 * vehicleType.fee_per_hour, 0.05);

    if (difference > maxAllowedDifference) {
      await logTraffic({
        device_id,
        card_id: vehicle.card_id,
        action: ActionTypes.EXIT_CASH,
        is_valid: false,
        details: "Fee mismatch",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      console.log(`Fee mismatch: ${calculatedFee} vs ${fee} for vehicle ${vehicle.vehicle_plate}`);
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "Fee mismatch",
          extra: { vehicle_plate: vehicle.vehicle_plate, fee: calculatedFee, need_payment: false },
        })
      );
    }

    const user = await User.findOne({ where: { user_id: vehicle.user_id } });
    if (!user) {
      await logTraffic({
        device_id,
        card_id: vehicle.card_id,
        action: ActionTypes.EXIT_CASH,
        is_valid: false,
        details: "User not found",
        embed_id,
        vehicle_plate: vehicle.vehicle_plate,
      });
      return publishResponse(
        buildResponse({
          topic,
          embed_id,
          status: ResponseStatuses.INVALID,
          message: "User not found",
          extra: { vehicle_plate: vehicle.vehicle_plate, need_payment: false },
        })
      );
    }

    await Sequelize.transaction(async (t) => {
      await session.update(
        { exit_time, status: "completed", payment_status: "paid", fee },
        { transaction: t }
      );
      await vehicle.update({ status: "exited" }, { transaction: t, hooks: false });
      await TransactionService.create(
        {
          user_id: user.user_id,
          balance: user.balance,
          amount: fee,
          session_id: session.session_id,
          device_id,
          payment_method: "cash",
        },
        t
      );
    });

    await logTraffic({
      device_id,
      action: ActionTypes.EXIT_CASH,
      card_id: vehicle.card_id,
      is_valid: true,
      embed_id,
      vehicle_plate,
    });
    publishResponse(
      buildResponse({
        topic,
        embed_id,
        status: ResponseStatuses.VALID,
        message: "Cash payment confirmed",
        extra: { vehicle_plate: vehicle.vehicle_plate, fee, payment_method: "cash", need_payment: false },
      })
    );

    createAndSendNotification(
      user.user_id,
      `Cash payment of ${fee} received for vehicle ${vehicle.vehicle_plate}`,
      "info"
    );
  } catch (error) {
    console.error("Cash confirm error:", error);
    await logTraffic({
      device_id,
      action: ActionTypes.EXIT_CASH,
      is_valid: false,
      details: `System error: ${error.message}`,
    });
    return publishResponse(
      buildResponse({
        topic: ActionTypes.EXIT,
        embed_id,
        status: ResponseStatuses.ERROR,
        message: "System error",
        extra: { need_payment: false },
      })
    );
  }
}

module.exports = { handleCardScan, cashConfirm };
const RfidCard = require("../models/rfidCardModel");
const Vehicle = require("../models/vehicleModel");
const ParkingSession = require("../models/parkingSessionModel");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const normalizeVehiclePlate = require("../utils/cleanVehiclePlate");
const { createAndSendNotification } = require("./notificationService");
exports.getAllVehicles = async () => {
  const vehicles = await Vehicle.findAll({
    include: [
      { model: RfidCard, as: "rfid_card", attributes: ["card_number"] },
    ],
  });
  return vehicles;
};

exports.getVehiclesByUserId = async (user_id) => {
  const vehicles = await Vehicle.findAll({
    where: { user_id },
    include: [
      { model: RfidCard, as: "rfid_card", attributes: ["card_number"] },
    ],
  });
  return vehicles;
};

exports.getYourVehicles = async (user_id) => {
  return await Vehicle.findAll({ where: { user_id } });
};

exports.getYourRecentVehicles = async (user_id) => {
  return await Vehicle.findAll({
    where: { user_id },
    order: [["updated_at", "DESC"]],
    limit: 5,
  });
};

exports.createVehicle = async ({
  user_id,
  vehicle_plate,
  vehicle_type_id,
  card_number,
}) => {
  const t = await sequelize.transaction();
  try {
    const normalizedPlate = normalizeVehiclePlate(vehicle_plate);
    const existingVehicle = await Vehicle.findOne({
      where: { vehicle_plate },
      transaction: t,
    });
    if (existingVehicle)
      throw { code: 400, message: "This vehicle is already registered." };

    const existingCard = await RfidCard.findOne({
      where: { card_number },
      transaction: t,
    });

    if (existingCard) {
      const existingVehicleWithCard = await Vehicle.findOne({
        where: { card_id: existingCard.card_id },
        transaction: t,
      });
      if (existingVehicleWithCard)
        throw {
          code: 400,
          message: "This card is already registered with another vehicle.",
        };
    }
    const newCard =
      existingCard ||
      (await RfidCard.create({ card_number, user_id }, { transaction: t }));

    const newVehicle = await Vehicle.create(
      {
        user_id,
        vehicle_plate: normalizedPlate,
        vehicle_type_id,
        status: "exited",
        card_id: newCard.card_id,
      },
      { transaction: t }
    );
    await createAndSendNotification(
      user_id,
      `Vehicle ${vehicle_plate} has been successfully registered.`,
      "success"
    );
    await t.commit();
    return newVehicle;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.assignNewCardToVehicle = async ({ vehicle_id, card_number }) => {
  const t = await sequelize.transaction();
  try {
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) throw { code: 400, message: "Vehicle not found." };
    if (vehicle.status === "parking")
      throw {
        code: 400,
        message: "Cannot assign card to actively parking vehicle",
      };
    let card = await RfidCard.findOne({
      where: { card_number },
      transaction: t,
    });
    if (!card) {
      card = await RfidCard.create(
        {
          card_number,
          user_id: vehicle.user_id,
        },
        { transaction: t }
      );
    } else {
      const assignedCard = await Vehicle.findOne({
        where: { card_id: card.card_id },
        transaction: t,
      });
      if (assignedCard)
        throw {
          code: 400,
          message: "This card is already registered with another vehicle.",
        };
    }
    await card.update({ user_id: vehicle.user_id }, { transaction: t });
    const oldCardId = vehicle.card_id;
    await vehicle.update({ card_id: card.card_id }, { transaction: t });
    if (oldCardId) {
      await RfidCard.update(
        { user_id: null },
        { where: { card_id: oldCardId }, transaction: t }
      );
    }
    await createAndSendNotification(
      vehicle.user_id,
      `New card has been assigned to vehicle ${vehicle.vehicle_plate}`,
      "success"
    );
    await t.commit();
    return vehicle;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.deleteVehicle = async (vehicleId) => {
  const t = await sequelize.transaction();
  try {
    const vehicle = await Vehicle.findByPk(vehicleId, { transaction: t });
    if (!vehicle) throw { code: 404, message: "Vehicle not found." };

    const activeSession = await ParkingSession.findOne({
      where: { vehicle_id: vehicle.vehicle_id, status: "active" },
      transaction: t,
    });

    if (activeSession)
      throw { code: 400, message: "Vehicle has active parking session." };

    const card = await RfidCard.findByPk(vehicle.card_id, { transaction: t });

    await vehicle.destroy({ transaction: t });

    if (card) {
      await card.destroy({ transaction: t });
    }

    await t.commit();
    return { message: "Vehicle and associated card deleted successfully." };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const RfidCard = require("../models/rfidCardModel");
const Vehicle = require("../models/vehicleModel");
const ParkingSession = require("../models/parkingSessionModel");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const normalizeVehiclePlate = require("../utils/cleanVehiclePlate");
exports.getAllVehicles = async () => {
  const vehicles = await Vehicle.findAll({
    include: [
      { model: RfidCard, as: "rfid_card", attributes: ["card_number"] },
    ],
  });
  return vehicles;
};

exports.getVehiclesByUserId = async (userId) => {
  const vehicles = await Vehicle.findAll({
    where: { user_id: userId },
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
    if (existingCard)
      throw { code: 400, message: "This card is already registered." };

    const newCard = await RfidCard.create(
      { card_number, user_id },
      { transaction: t }
    );

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

    await t.commit();
    return newVehicle;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.deleteVehicle = async (vehicleId) => {
  const vehicle = await Vehicle.findByPk(vehicleId);
  if (!vehicle) throw { code: 404, message: "Vehicle not found." };

  const activeSession = await ParkingSession.findOne({
    where: { vehicle_id: vehicle.vehicle_id, status: "active" },
  });

  if (activeSession)
    throw { code: 400, message: "Vehicle has active parking session." };

  const card = await RfidCard.findByPk(vehicle.card_id);
  await vehicle.destroy();
  if (card) await card.destroy();
};

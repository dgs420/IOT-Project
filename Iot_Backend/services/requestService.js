const Request = require("../models/requestModel");
const RfidCard = require("../models/rfidCardModel");
const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const { createAndSendNotification } = require("./notificationService");
const sequelize = require("../config/database");

exports.getAllRequests = async () => {
  return await Request.findAll();
};

exports.getRequestsByUserId = async (user_id) => {
  return await Request.findAll({ where: { user_id } });
};

exports.createRequest = async ({
  user_id,
  vehicle_number,
  vehicle_type_id,
  name,
  contact_number,
  delivery_address,
}) => {
  const existingVehicle = await Vehicle.findOne({ where: { vehicle_number } });
  if (existingVehicle)
    throw { code: 400, message: "This vehicle is already registered." };

  const existingRequest = await Request.findOne({
    where: { vehicle_number, status: "pending" },
  });
  if (existingRequest)
    throw { code: 400, message: "A request is already sent for this vehicle." };

  return await Request.create({
    user_id,
    vehicle_number,
    vehicle_type_id,
    name,
    contact_number,
    delivery_address,
  });
};

exports.rejectRequest = async (request_id, reason) => {
  const request = await Request.findByPk(request_id);
  if (!request) throw { code: 404, message: "Request not found" };

  if (request.status !== "pending")
    throw { code: 400, message: "Request already resolved" };

  await request.update({ status: "rejected", reason });

  await createAndSendNotification(
    request.user_id,
    `Your request for vehicle ${request.vehicle_number} has been rejected. Reason: ${reason}`,
    "fail"
  );
};

exports.approveRequest = async (request_id, card_number) => {
  const request = await Request.findByPk(request_id);
  if (!request) throw { code: 404, message: "Request not found" };

  if (request.status !== "pending")
    throw { code: 400, message: "Request already resolved" };

  const existingVehicle = await Vehicle.findOne({
    where: { vehicle_number: request.vehicle_number },
  });
  if (existingVehicle)
    throw { code: 400, message: "This vehicle is already registered." };

  const existingCard = await RfidCard.findOne({ where: { card_number } });
  if (existingCard)
    throw { code: 400, message: "This card is already registered" };

  const transaction = await sequelize.transaction();
  try {
    const newCard = await RfidCard.create(
      {
        card_number,
        user_id: request.user_id,
      },
      { transaction }
    );

    const newVehicle = await Vehicle.create(
      {
        user_id: request.user_id,
        vehicle_number: request.vehicle_number,
        vehicle_type_id: request.vehicle_type_id,
        status: "exited",
        card_id: newCard.card_id,
      },
      { transaction }
    );

    await request.update({ status: "approved" }, { transaction });

    await transaction.commit();

    await createAndSendNotification(
      request.user_id,
      `Your request for vehicle ${request.vehicle_number} has been approved`,
      "success"
    );

    return newVehicle;
  } catch (error) {
    await transaction.rollback();
    throw { code: 500, message: "Approval failed: " + error.message };
  }
};
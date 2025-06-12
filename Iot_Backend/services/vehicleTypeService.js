const VehicleType = require("../models/vehicleTypeModel");

async function createVehicleType({
  vehicle_type_name,
  description,
  fee_per_hour,
}) {
  if (!vehicle_type_name || typeof vehicle_type_name !== "string") {
    throw {
      status: 400,
      message: "Vehicle type name is required and must be a string.",
    };
  }

  const parsedFee = parseFloat(fee_per_hour);
  if (isNaN(parsedFee) || parsedFee <= 0) {
    throw {
      status: 400,
      message: "Fee per hour must be a valid positive number.",
    };
  }

  const existing = await VehicleType.findOne({ where: { vehicle_type_name } });
  if (existing) {
    throw { status: 400, message: "Vehicle type already exists." };
  }

  const newType = await VehicleType.create({
    vehicle_type_name,
    description,
    fee_per_hour: parsedFee,
  });

  return newType;
}

module.exports = { createVehicleType };

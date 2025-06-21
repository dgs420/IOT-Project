const VehicleType = require("../models/vehicleTypeModel");
const Vehicle = require("../models/vehicleModel");

async function createVehicleType({ vehicle_type_name, description, fee_per_hour }) {
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

async function getAllVehicleTypes() {
  const types = await VehicleType.findAll();
  if (!types || types.length === 0) {
    throw { status: 404, message: "No vehicle types found" };
  }
  return types;
}

async function deleteVehicleTypeById(typeId) {
  const vehicleType = await VehicleType.findByPk(typeId);
  if (!vehicleType) {
    throw { status: 404, message: "Vehicle type not found." };
  }

  const associatedVehicle = await Vehicle.findOne({
    where: { vehicle_type_id: typeId },
  });

  if (associatedVehicle) {
    throw {
      status: 400,
      message: "Vehicle type cannot be deleted while having associated vehicles.",
    };
  }

  await vehicleType.destroy();
  return true;
}

async function updateVehicleType(data) {
  const { vehicle_type_id, vehicle_type_name, description, fee_per_hour } = data;

  const vehicleType = await VehicleType.findByPk(vehicle_type_id);
  if (!vehicleType) {
    throw { status: 404, message: "Vehicle type not found" };
  }

  if (vehicle_type_name && vehicle_type_name !== vehicleType.vehicle_type_name) {
    const existingName = await VehicleType.findOne({ where: { vehicle_type_name } });
    if (existingName) {
      throw { status: 400, message: "Vehicle type with the same name already exists" };
    }
  }

  if (fee_per_hour !== undefined && fee_per_hour <= 0) {
    throw { status: 400, message: "Fee must be greater than 0" };
  }

  const updatedFields = {};
  if (vehicle_type_name) updatedFields.vehicle_type_name = vehicle_type_name;
  if (description) updatedFields.description = description;
  if (fee_per_hour !== undefined) updatedFields.fee_per_hour = fee_per_hour;

  await vehicleType.update(updatedFields);
  return vehicleType;
}

module.exports = {
  createVehicleType,
  getAllVehicleTypes,
  deleteVehicleTypeById,
  updateVehicleType,
};

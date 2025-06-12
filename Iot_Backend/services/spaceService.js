const { fn, col } = require("sequelize");
const ParkingSpace = require("../models/parkingSpaceModel");
const Vehicle = require("../models/vehicleModel");
const VehicleType = require("../models/vehicleTypeModel");

exports.create = async ({ vehicle_type_id, total_spaces }) => {
  if (!vehicle_type_id || isNaN(vehicle_type_id)) {
    return { code: 400, message: "Vehicle type ID is required and must be a number." };
  }
  if (!total_spaces || isNaN(total_spaces) || total_spaces <= 0) {
    return { code: 400, message: "Total spaces must be a valid positive number." };
  }

  const vehicleType = await VehicleType.findByPk(vehicle_type_id);
  if (!vehicleType) {
    return { code: 404, message: "Vehicle type not found." };
  }

  const existingSpace = await ParkingSpace.findOne({ where: { vehicle_type_id } });
  if (existingSpace) {
    return { code: 400, message: "Parking space already exists for this vehicle type." };
  }

  const newSpace = await ParkingSpace.create({ vehicle_type_id, total_spaces });
  return { code: 200, message: "Parking space created successfully.", info: newSpace };
};

exports.update = async ({ space_id, total_spaces }) => {
  if (!space_id || isNaN(space_id)) {
    return { code: 400, message: "Space ID is required and must be a number." };
  }
  if (!total_spaces || isNaN(total_spaces) || total_spaces <= 0) {
    return { code: 400, message: "Total spaces must be a valid positive number." };
  }

  const space = await ParkingSpace.findByPk(space_id);
  if (!space) {
    return { code: 404, message: "Parking space not found." };
  }

  const occupiedData = await Vehicle.findOne({
    attributes: [[fn("COUNT", col("vehicle_id")), "occupied"]],
    where: { vehicle_type_id: space.vehicle_type_id, status: "parking" },
    raw: true,
  });

  const occupied = parseInt(occupiedData?.occupied || 0);
  if (total_spaces < occupied) {
    return {
      code: 400,
      message: `Cannot reduce total spaces below currently occupied (${occupied}).`,
    };
  }

  space.total_spaces = total_spaces;
  await space.save();

  return { code: 200, message: "Parking space updated successfully.", info: space };
};

exports.getAll = async () => {
  const spaces = await ParkingSpace.findAll();
  const occupiedCounts = await Vehicle.findAll({
    attributes: ["vehicle_type_id", [fn("COUNT", col("vehicle_id")), "occupied"]],
    where: { status: "parking" },
    group: ["vehicle_type_id"],
    raw: true,
  });

  const countMap = {};
  occupiedCounts.forEach(row => {
    countMap[row.vehicle_type_id] = parseInt(row.occupied);
  });

  const info = spaces.map(space => {
    const occupied = countMap[space.vehicle_type_id] || 0;
    return {
      space_id: space.space_id,
      vehicle_type_id: space.vehicle_type_id,
      total_spaces: space.total_spaces,
      occupied_spaces: occupied,
      available_spaces: space.total_spaces - occupied,
    };
  });

  return { code: 200, message: "Parking space information fetched successfully.", info };
};

exports.remove = async ({ space_id }) => {
  if (!space_id || isNaN(space_id)) {
    return { code: 400, message: "Space ID is required and must be a number." };
  }

  const space = await ParkingSpace.findByPk(space_id);
  if (!space) {
    return { code: 404, message: "Parking space not found." };
  }

  const occupiedVehicle = await Vehicle.findOne({
    where: { vehicle_type_id: space.vehicle_type_id, status: "parking" },
  });

  if (occupiedVehicle) {
    return { code: 400, message: "Cannot delete while vehicles are parking." };
  }

  await space.destroy();
  return { code: 200, message: "Parking space deleted successfully." };
};
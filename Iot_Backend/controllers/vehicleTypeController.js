const Vehicle = require("../models/vehicleModel");
const VehicleType = require("../models/vehicleTypeModel");
// const RfidCard=require("../models/rfidCardModel");

exports.getAllVehicleType = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.findAll();
    if (!vehicleTypes || vehicleTypes.length === 0) {
      return res.status(404).json({ message: "No vehicles type found" });
    }

    res.status(200).json({
      code: 200,
      message: "All vehicles types Successfully Fetched",
      info: vehicleTypes,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};

exports.createVehicleType = async (req, res) => {
  const { vehicle_type_name, description, fee_per_hour } = req.body;

  if (!vehicle_type_name || typeof vehicle_type_name !== "string") {
    return res.status(400).json({ code: 400, message: "Vehicle type name is required and must be a string." });
  }
  if (!fee_per_hour || isNaN(fee_per_hour) || fee_per_hour <= 0) {
    return res.status(400).json({ code: 400, message: "Fee per hour must be a valid positive number." });
  }

  try {
    const existingType = await VehicleType.findOne({
      where: { vehicle_type_name },
    });

    if (existingType) {
      return res.json({
        code: 400,
        message: "Vehicle type already exists.",
      });
    }

    // Create a new card
    const newVehicleType = await VehicleType.create({
      vehicle_type_name,
      description,
      fee_per_hour,
    });

    res.status(201).json({
      code: 200,
      message: "New vehicle type created successfully.",
      info: newVehicleType,
    });
  } catch (error) {
    console.error("Error creating vehicle type:", error);
    res.json({
      code: 500,
      message: "Server error.",
    });
  }
};

exports.deleteVehicleType = async (req, res) => {
  const { vehicleTypeId } = req.params;

  try {
    // Find the user by primary key
    const vehicleType = await VehicleType.findByPk(vehicleTypeId);
    if (!vehicleType) {
      return res.status(404).json({
        code: 404,
        message: "Vehicle type not found.",
      });
    }

    // Check if the type has associated vehicles
    const vehicle = await Vehicle.findOne({ where: { vehicle_type_id: vehicleTypeId } });
    if (vehicle) {
        return res.status(400).json({
            code: 400,
            message: 'Vehicle type cannot be deleted while having associated vehicles.',
        });
    }
    // Delete the type
    await vehicleType.destroy();

    res.status(200).json({
      code: 200,
      message: "Vehicle type deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting Vehicle type:", error);
    res.json({
      code: 500,
      error: "Failed to delete Vehicle type.",
    });
  }
};

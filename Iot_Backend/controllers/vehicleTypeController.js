const Vehicle = require("../models/vehicleModel");
const VehicleType = require("../models/vehicleTypeModel");
const vehicleTypeService = require("../services/vehicleTypeService");

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

// exports.createVehicleType = async (req, res) => {
//   const { vehicle_type_name, description, fee_per_hour } = req.body;

//   if (!vehicle_type_name || typeof vehicle_type_name !== "string") {
//     return res
//       .status(400)
//       .json({
//         code: 400,
//         message: "Vehicle type name is required and must be a string.",
//       });
//   }
//   if (!fee_per_hour || isNaN(fee_per_hour) || fee_per_hour <= 0) {
//     return res
//       .status(400)
//       .json({
//         code: 400,
//         message: "Fee per hour must be a valid positive number.",
//       });
//   }

//   try {
//     const existingType = await VehicleType.findOne({
//       where: { vehicle_type_name },
//     });

//     if (existingType) {
//       return res.json({
//         code: 400,
//         message: "Vehicle type already exists.",
//       });
//     }

//     // Create a new card
//     const newVehicleType = await VehicleType.create({
//       vehicle_type_name,
//       description,
//       fee_per_hour,
//     });

//     res.status(201).json({
//       code: 200,
//       message: "New vehicle type created successfully.",
//       info: newVehicleType,
//     });
//   } catch (error) {
//     console.error("Error creating vehicle type:", error);
//     res.json({
//       code: 500,
//       message: "Server error.",
//     });
//   }
// };

exports.createVehicleType = async (req, res) => {
  try {
    const newType = await vehicleTypeService.createVehicleType(req.body);
    res.status(201).json({
      code: 200,
      message: "New vehicle type created successfully.",
      info: newType,
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      code: status,
      message: err.message || "Server error",
    });
  }
};

exports.deleteVehicleType = async (req, res) => {
  const { typeId } = req.params;

  try {
    const vehicleType = await VehicleType.findByPk(typeId);
    if (!vehicleType) {
      return res.status(404).json({
        code: 404,
        message: "Vehicle type not found.",
      });
    }

    // Check if the type has associated vehicles
    const vehicle = await Vehicle.findOne({
      where: { vehicle_type_id: typeId },
    });
    if (vehicle) {
      return res.status(400).json({
        code: 400,
        message:
          "Vehicle type cannot be deleted while having associated vehicles.",
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

exports.updateVehicleType = async (req, res) => {
  const { vehicle_type_id, vehicle_type_name, description, fee_per_hour } = req.body;

  try {
    const vehicleType = await VehicleType.findByPk(vehicle_type_id);
    if (!vehicleType) {
      return res.status(404).json({
        code: 404,
        message: "Vehicle type not found",
      });
    }

    if (
      vehicle_type_name &&
      vehicle_type_name !== vehicleType.vehicle_type_name
    ) {
      const existingName = await VehicleType.findOne({
        where: { vehicle_type_name },
      });
      if (existingName) {
        return res.status(400).json({
          code: 400,
          message: "Vehicle type with the same name already exists",
        });
      }
    }

    if (fee_per_hour !== undefined && fee_per_hour <= 0) {
      return res.status(400).json({
        code: 400,
        message: "Fee must be greater than 0",
      });
    }

    const updatedFields = {};
    if (vehicle_type_name) updatedFields.vehicle_type_name = vehicle_type_name;
    if (description) updatedFields.description = description;
    if (fee_per_hour !== undefined) updatedFields.fee_per_hour = fee_per_hour;

    await vehicleType.update(updatedFields);

    res.json({
      code: 200,
      message: "Vehicle type updated successfully",
      info: vehicleType, // returns the updated instance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};
const vehicleTypeService = require("../services/vehicleTypeService");

exports.getAllVehicleType = async (req, res) => {
  try {
    const vehicleTypes = await vehicleTypeService.getAllVehicleTypes();
    res.status(200).json({
      code: 200,
      message: "All vehicle types successfully fetched",
      info: vehicleTypes,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status,
      message: error.message || "Server error",
    });
  }
};

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
  try {
    await vehicleTypeService.deleteVehicleTypeById(req.params.typeId);
    res.status(200).json({
      code: 200,
      message: "Vehicle type deleted successfully.",
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      code: status,
      message: err.message || "Server error",
    });
  }
};

exports.updateVehicleType = async (req, res) => {
  try {
    const updated = await vehicleTypeService.updateVehicleType(req.body);
    res.status(200).json({
      code: 200,
      message: "Vehicle type updated successfully.",
      info: updated,
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      code: status,
      message: err.message || "Server error",
    });
  }
};

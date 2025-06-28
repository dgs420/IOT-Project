const vehicleService = require("../services/vehicleService");

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res
      .status(200)
      .json({ code: 200, message: "All vehicles fetched", info: vehicles });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Server error" });
  }
};

exports.getVehiclesByUserId = async (req, res) => {
  try {
    const vehicles = await vehicleService.getVehiclesByUserId(
      req.params.userId
    );

    res
      .status(200)
      .json({ code: 200, message: "Vehicles fetched", info: vehicles });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Server error" });
  }
};

exports.getYourVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getYourVehicles(req.user.user_id);
    res
      .status(200)
      .json({ code: 200, message: "Vehicles fetched", info: vehicles });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Server error" });
  }
};

exports.getYourRecentVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getYourRecentVehicles(
      req.user.user_id
    );
    res
      .status(200)
      .json({ code: 200, message: "Vehicles fetched", info: vehicles });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Server error" });
  }
};

exports.createVehicle = async (req, res) => {
  const { user_id, vehicle_plate, vehicle_type_id, card_number } = req.body;
  if (!user_id || !vehicle_plate || !vehicle_type_id || !card_number) {
    return res
      .status(400)
      .json({ code: 400, message: "Missing required fields." });
  }
  try {
    const newVehicle = await vehicleService.createVehicle({
      user_id,
      vehicle_plate,
      vehicle_type_id,
      card_number,
    });
    res.status(201).json({
      code: 200,
      message: "Vehicle created successfully.",
      info: newVehicle,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message || "Server error",
    });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(req.params.vehicleId);
    res
      .status(200)
      .json({ code: 200, message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message || "Server error",
    });
  }
};

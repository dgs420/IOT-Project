const deviceService = require("../services/deviceService");

exports.createDevice = async (req, res) => {
  try {
    const newDevice = await deviceService.createDevice(req.body);
    res.status(200).json({
      code: 200,
      message: "Device created successfully",
      info: newDevice,
    });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.getAllDevice = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res
      .status(200)
      .json({ code: 200, message: "Devices found", info: devices });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        message: error.message || "Failed to retrieve devices",
      });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await deviceService.getDeviceById(req.params.deviceId);
    res
      .status(200)
      .json({
        code: 200,
        message: "Device retrieved successfully",
        info: device,
      });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.getDeviceByEmbedId = async (req, res) => {
  try {
    const device = await deviceService.getDeviceByEmbedId(req.params.embedId);
    res
      .status(200)
      .json({
        code: 200,
        message: "Device retrieved successfully",
        info: device,
      });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const updated = await deviceService.updateDevice(
      req.params.deviceId,
      req.body
    );
    res
      .status(200)
      .json({
        code: 200,
        message: "Device updated successfully",
        info: updated,
      });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    await deviceService.deleteDevice(req.params.deviceId);
    res.status(200).json({ code: 200, message: "Device deleted successfully" });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.commandDevice = async (req, res) => {
  try {
    const result = await deviceService.commandDevice(req.body);
    res.status(200).json({ code: 200, ...result });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

const parkingSpaceService = require("../services/spaceService");

exports.createParkingSpace = async (req, res) => {
  try {
    const result = await parkingSpaceService.create(req.body);
    res.status(result.code === 200 ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error creating parking space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateParkingSpace = async (req, res) => {
  try {
    const result = await parkingSpaceService.update(req.body);
    res.status(result.code === 200 ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error updating parking space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getParkingSpaces = async (req, res) => {
  try {
    const result = await parkingSpaceService.getAll();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching parking space info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteParkingSpace = async (req, res) => {
  try {
    const result = await parkingSpaceService.remove(req.body);
    res.status(result.code === 200 ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error deleting parking space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
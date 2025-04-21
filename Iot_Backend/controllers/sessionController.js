const ParkingSession = require("../models/parkingSessionModel");
const Session = require("../models/parkingSessionModel");
const TrafficLog = require("../models/trafficLogModel");
const Vehicle = require("../models/vehicleModel");

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.status(200).json({
      code: 200,
      message: "All sessions fetched",
      info: sessions,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    // const sessions = await Session.findAll({
    //   where: { user_id },
    // });

    const sessions = await ParkingSession.findAll({
      include: [
        {
          model: Vehicle,
          where: { user_id: userId },
          attributes: ["vehicle_number"], 
        },
      ],
    });
    res.status(200).json({
      code: 200,
      message: "All sessions fetched",
      info: sessions,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

exports.getYourSessions = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    // const sessions = await Session.findAll({
    //   where: { user_id },
    // });

    const sessions = await ParkingSession.findAll({
      include: [
        {
          model: Vehicle,
          where: { user_id: user_id },
          attributes: ["vehicle_number"], 
        },
      ],
    });
    res.status(200).json({
      code: 200,
      message: "All sessions fetched",
      info: sessions,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};



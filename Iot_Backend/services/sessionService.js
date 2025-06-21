const ParkingSession = require("../models/parkingSessionModel");
const Vehicle = require("../models/vehicleModel");

exports.getAllSessions = async () => {
  const sessions = await ParkingSession.findAll({
    include: [{ model: Vehicle }],
  });
  return sessions;
};

exports.getUserSessions = async (userId) => {
  const sessions = await ParkingSession.findAll({
    include: [
      {
        model: Vehicle,
        where: { user_id: userId },
        attributes: ["vehicle_number"],
      },
    ],
  });
  return sessions;
};

exports.getYourSessions = async (userId) => {
  const sessions = await ParkingSession.findAll({
    include: [
      {
        model: Vehicle,
        where: { user_id: userId },
        attributes: ["vehicle_number"],
      },
    ],
  });
  return sessions;
};

exports.closeActiveSession = async (sessionId) => {
  const session = await ParkingSession.findByPk(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.code = 404;
    throw error;
  }
  await session.update({ status: "completed" });
  return session;
};
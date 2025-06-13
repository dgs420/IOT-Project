const sessionService = require("../services/sessionService");

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();
    res.status(200).json({ code: 200, message: "All sessions fetched", info: sessions });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getUserSessions(req.params.userId);
    res.status(200).json({ code: 200, message: "All sessions fetched", info: sessions });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getYourSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getYourSessions(req.user.user_id);
    res.status(200).json({ code: 200, message: "All sessions fetched", info: sessions });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.closeActiveSession = async (req, res) => {
  try {
    const session = await sessionService.closeActiveSession(req.params.sessionId);
    res.status(200).json({ code: 200, message: "Session closed", info: session });
  } catch (error) {
    res.status(error.code || 500).json({ code: error.code || 500, message: error.message });
  }
};

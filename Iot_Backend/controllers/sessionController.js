const sessionService = require("../services/sessionService");

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();
    res
      .status(200)
      .json({ code: 200, message: "All sessions fetched", info: sessions });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getTransactionSession = async (req, res) => {
  try {
    const session = await sessionService.getTransactionSession(
      req.user.user_id,
      req.query.sessionId
    );
    res
      .status(200)
      .json({ code: 200, message: "Session fetched", info: session });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getPaginatedSessions = async (req, res) => {
  try {
    const result = await sessionService.getPaginatedsSessions(req.query);
    res.status(200).json({
      code: 200,
      message: "Sessions fetched successfully",
      info: result.sessions,
      pagination: result.pagination,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
};
exports.getPaginatedUserSessions = async (req, res) => {
  try {
    const result = await sessionService.getPaginatedsSessions(
      req.query,
      req.params.userId
    );
    res.status(200).json({
      code: 200,
      message: "All sessions fetched",
      info: result.sessions,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getPaginatedYourSessions = async (req, res) => {
  try {
    const result = await sessionService.getPaginatedsSessions(
      req.query,
      req.user.user_id
    );
    res.status(200).json({
      code: 200,
      message: "All sessions fetched",
      info: result.sessions,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getUserSessions(req.params.userId);
    res
      .status(200)
      .json({ code: 200, message: "All sessions fetched", info: sessions });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getYourSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getYourSessions(req.user.user_id);
    res
      .status(200)
      .json({ code: 200, message: "All sessions fetched", info: sessions });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.closeActiveSession = async (req, res) => {
  try {
    const session = await sessionService.closeActiveSession(
      req.params.sessionId
    );
    res
      .status(200)
      .json({ code: 200, message: "Session closed", info: session });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

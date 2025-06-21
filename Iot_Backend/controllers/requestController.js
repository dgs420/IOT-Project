const requestService = require("../services/requestService");

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await requestService.getAllRequests();
    res.status(200).json({
      code: 200,
      message: "All requests fetched",
      info: requests,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message,
    });
  }
};

exports.getYourRequests = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const requests = await requestService.getRequestsByUserId(user_id);
    res.status(200).json({
      code: 200,
      message: "All requests fetched",
      info: requests,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message,
    });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const data = {
      ...req.body,
      user_id,
    };
    const newRequest = await requestService.createRequest(data);
    res.status(201).json({
      code: 200,
      message: "Request created successfully",
      info: newRequest,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message,
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request_id = req.params.requestId;
    const { reason } = req.body;
    await requestService.rejectRequest(request_id, reason);
    res.status(200).json({
      code: 200,
      message: "Request rejected",
    });
  } catch (error) {
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message,
    });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request_id = req.params.requestId;
    const { card_number } = req.body;

    if (!card_number) {
      return res.status(400).json({
        code: 400,
        message: "Card number is required",
      });
    }

    const newVehicle = await requestService.approveRequest(
      request_id,
      card_number
    );

    res.status(200).json({
      code: 200,
      message: "Request approved successfully",
      info: newVehicle,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message,
    });
  }
};

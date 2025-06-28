const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res
      .status(200)
      .json({ code: 200, message: "Users fetched successfully", info: users });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Failed to retrieve users" });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const user = await userService.getUserDetail(req.params.userId);
    res
      .status(200)
      .json({ code: 200, message: "User found successfully", info: user });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const result = await userService.changePassword(req.user.user_id, req.body.old_password, req.body.new_password);
    res.status(200).json({ code: 200, message: result });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.changePasswordAsAdmin = async (req, res) => {
  try {
    const result = await userService.changePasswordAdmin(req.body.user_id,req.body.password);
    res.status(200).json({ code: 200, message: result });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.getPersonalDetail = async (req, res) => {
  try {
    const user = await userService.getPersonalDetail(req.user.user_id);
    res
      .status(200)
      .json({ code: 200, message: "User found successfully", info: user });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.getUserBalance = async (req, res) => {
  try {
    const user = await userService.getPersonalDetail(req.user.user_id);
    res
      .status(200)
      .json({ code: 200, message: "User balance", info: user.balance });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.userId, req.user);
    res.status(200).json({ code: 200, message: result });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.userId,
      req.body
    );
    res.json({
      code: 200,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateProfile(
      req.user.user_id,
      req.body
    );
    res.json({
      code: 200,
      message: "User updated successfully",
      info: updatedUser,
    });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

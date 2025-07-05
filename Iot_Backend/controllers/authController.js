const authService = require("../services/authService");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sendResetEmail } = require("../utils/sendResetPassMail");
exports.createUser = async (req, res) => {
  try {
    const result = await authService.createUser(req.body);
    res.status(201).json({ code: 200, message: "User created" });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ code: 400, message: "User not found" });
  }

  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15);

  user.reset_token = token;
  user.reset_token_expiry = expiry;
  await user.save();

  const resetLink = `http://localhost:5174/reset-password?token=${token}`;

  await sendResetEmail(user.email, resetLink);

  res.json({ code: 200, message: "Password reset link sent" });
};

exports.resetForgotPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    where: {
      reset_token: token,
      reset_token_expiry: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ code: 400, message: "Invalid or expired token" });
  }

  user.password =  await bcrypt.hash(newPassword, 10);
  user.reset_token = null;
  user.reset_token_expiry = null;
  await user.save();

  res.json({code: 200, message: "Password has been reset successfully" });
};

exports.signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ code: 200, message: "Sign up success" });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const info = await authService.login(req.body);
    res.json({ code: 200, message: "Log in success", info });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const info = await authService.loginAdmin(req.body);
    res.json({ code: 200, message: "Log in success", info });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

// services/userService.js
const User = require("../models/userModel");
const Card = require("../models/rfidCardModel");
const bcrypt = require("bcrypt");

exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.getUserDetail = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
  if (!user) throw { code: 404, message: "User does not exist" };
  return user;
};

exports.getPersonalDetail = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
  if (!user) throw { code: 404, message: "User does not exist" };
  return user;
};

exports.deleteUser = async (userId, currentUser) => {
  if (parseInt(userId) === currentUser.user_id) {
    throw { code: 400, message: "You cannot delete your own account." };
  }
  const user = await User.findByPk(userId);
  if (!user) throw { code: 404, message: "User not found." };

  const card = await Card.findOne({ where: { user_id: userId } });
  if (card) throw { code: 400, message: "User cannot be deleted while having associated RFID cards." };

  await user.destroy();
  return "User deleted successfully.";
};

exports.updateUser = async (userId, updates) => {
  const { email, password, username, role, first_name, last_name } = updates;
  const user = await User.findByPk(userId);
  if (!user) throw { code: 404, message: "User not found" };

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw { code: 400, message: "Email already taken" };
  }
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) throw { code: 400, message: "Username already taken" };
  }

  const updatedFields = { email, username, role, first_name, last_name };
  if (password) updatedFields.password = await bcrypt.hash(password, 10);

  await user.update(updatedFields);
  return {
    id: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

exports.updateProfile = async (userId, updates) => {
  const { email, username, first_name, last_name } = updates;
  const user = await User.findByPk(userId);
  if (!user) throw { code: 404, message: "User not found" };

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw { code: 400, message: "Email already taken" };
  }
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) throw { code: 400, message: "Username already taken" };
  }

  const updatedFields = { email, username, first_name, last_name };
  await user.update(updatedFields);
  return {
    id: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

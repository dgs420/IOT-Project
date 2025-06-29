const User = require("../models/userModel");
const Card = require("../models/rfidCardModel");
const Vehicle = require("../models/vehicleModel");
const sequelize = require("../config/database");

const bcrypt = require("bcryptjs");

exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.getUserDetail = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw { code: 404, message: "User does not exist" };
  return user;
};

exports.changePassword = async (userId, oldPassword, password) => {
  const user = await User.findByPk(userId);
  if (!user) throw { code: 404, message: "User does not exist" };
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw { code: 400, message: "Old password is incorrect" };
  user.password = await bcrypt.hash(password, 10);
  await user.save();
  return "Password changed successfully.";
};

exports.changePasswordAdmin = async (userId, password) => {
  const user = await User.findByPk(userId);
  if (!user) throw { code: 404, message: "User does not exist" };

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  return "Password changed successfully.";
};

exports.getPersonalDetail = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw { code: 404, message: "User does not exist" };
  return user;
};

exports.deleteUser = async (userId, currentUser) => {
  if (parseInt(userId) === currentUser.user_id) {
    throw { code: 400, message: "You cannot delete your own account." };
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) throw { code: 404, message: "User not found." };

    const card = await Card.findOne({
      where: { user_id: userId },
      transaction,
    });
    if (card) {
      throw {
        code: 400,
        message: "User cannot be deleted while having associated RFID cards.",
      };
    }

    const vehicle = await Vehicle.findOne({
      where: { user_id: userId },
      transaction,
    });
    if (vehicle) {
      throw {
        code: 400,
        message: "User cannot be deleted while having registered vehicles.",
      };
    }

    await user.destroy({ transaction });

    await transaction.commit();
    return "User deleted successfully.";
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.updateUser = async (userId, updates) => {
  const { email, username, role, first_name, last_name } = updates;
  const user = await User.findByPk(userId);
  if (!user) throw { code: 404, message: "User not found" };

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw { code: 400, message: "Email already taken" };
  }
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername)
      throw { code: 400, message: "Username already taken" };
  }

  const updatedFields = { email, username, role, first_name, last_name };
  // if (password) updatedFields.password = await bcrypt.hash(password, 10);

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
    if (existingUsername)
      throw { code: 400, message: "Username already taken" };
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

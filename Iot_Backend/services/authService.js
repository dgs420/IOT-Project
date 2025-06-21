const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async ({
  email,
  password,
  username,
  role,
  first_name,
  last_name,
}) => {
  if (!email || !password)
    throw { code: 400, message: "Email and password are required" };

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw { code: 400, message: "Email already taken" };

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) throw { code: 400, message: "Username already taken" };

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    email,
    password: hashedPassword,
    username,
    role,
    first_name,
    last_name,
  });
};

exports.signup = async ({ email, password, first_name, last_name }) => {
  if (!email || !password)
    throw { code: 400, message: "Email and password are required" };

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw { code: 400, message: "Email already taken" };

  const generateUsername = (email) => {
    const base = email.split("@")[0];
    return `${base}${Math.floor(Math.random() * 1000)}`;
  };

  let username = generateUsername(email);
  while (await User.findOne({ where: { username } })) {
    username = generateUsername(email);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    email,
    password: hashedPassword,
    username,
    role: "user",
    first_name,
    last_name,
  });
};

exports.login = async ({ email, password }) => {
  if (!email || !password)
    throw { code: 400, message: "Email and password are required" };

  const user = await User.findOne({ where: { email } });
  if (!user) throw { code: 401, message: "User not found" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw { code: 401, message: "Invalid password" };

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user_id: user.user_id,
    username: user.username,
    role: user.role,
  };
};

exports.loginAdmin = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { code: 401, message: "User not found" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw { code: 401, message: "Invalid password" };

  if (user.role !== "admin")
    throw {
      code: 403,
      message: "You do not have permission to access this resource",
    };

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user_id: user.user_id,
    username: user.username,
    role: user.role,
  };
};

const TrafficLog = require("../models/trafficLogModel");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const res = require("express/lib/response");

// Signup function with email
exports.createUser = async (req, res) => {
  const { email, password, username, role, first_name, last_name } = req.body;

  // Check if email or password are missing
  if (!email || !password) {
    return res.json({
      code: 400,
      message: "Email and password are required",
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({
        code: 400,
        message: "Email already taken",
      });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.json({
        code: 400,
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      role,
      first_name,
      last_name,
    });

    // const token = jwt.sign({ id: newUser.user_id}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      code: 200,
      message: "User created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.signup = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // Check if email or password are missing
  if (!email || !password) {
    return res.json({
      code: 400,
      message: "Email and password are required",
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "Email already taken",
      });
    }

    const generateUsername = (email) => {
      const baseUsername = email.split("@")[0]; // Get the part before the '@'
      const randomSuffix = Math.floor(Math.random() * 1000); // Random number between 0-999
      return `${baseUsername}${randomSuffix}`; // Combine them
    };

    let username = generateUsername(email);
    let existingUsername = await User.findOne({ where: { username } });

    while (existingUsername) {
      username = generateUsername(email); // Regenerate if username exists
      existingUsername = await User.findOne({ where: { username } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      role: "user",
      first_name,
      last_name,
    });

    // const token = jwt.sign({ id: newUser.user_id}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      code: 200,
      message: "Sign up success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      code: 400,
      message: "Email and password are required",
    });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "User not found",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        code: 401,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      code: 200,
      message: "Log in success",
      info: {
        token: token,
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      code: 400,
      message: "Email and password are required",
    });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "User not found",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        code: 401,
        message: "Invalid password",
      });
    }


    if (user.role !== "admin") {
      return res.status(401).json({
        code: 403,
        message: "You do not have permission to access this resource",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      code: 200,
      message: "Log in success",
      info: {
        token: token,
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const TrafficLog = require('../models/trafficLogModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// Signup function with email
exports.signup = async (req, res) => {
    const { email, password ,username, role, first_name,last_name} = req.body;

    // Check if email or password are missing
    if (!email || !password) {
        return res.json({
            code:400,
            message: 'Email and password are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.json({
                code:400,
                message: 'Email already taken' });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.json({
                code:400,
                message: 'Username already taken' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and store the new user
        const newUser = await User.create({ email, password: hashedPassword, username, role,first_name,last_name });

        // Optionally create a token to auto-login upon sign-up
        // const token = jwt.sign({ id: newUser.user_id}, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            code: 200,
            message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login function with email
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                code: 401,
                message: 'Invalid credentials' });
        }

        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            code: 200,
            message:"Log in success",
            token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
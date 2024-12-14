const TrafficLog = require('../models/trafficLogModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json({
          code:200,
          message: 'Users fetched successfully',
          info: users
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  };

exports.getUserDetail = async (req, res) => {
    const userId = req.params.userId;
     try{
         const user = await User.findByPk(userId);
         if(!user){
             return res.status(404).json({
                 code:404,
                 message:'User does not exist'});
         }

         res.status(200).json({
             code:200,
             message:"User found successfully",
             info:user});
     } catch (error){
         console.error(error);
         res.status(500).json({ error: 'Failed to retrieve users' });
     }
}
// Signup function with email
exports.signup = async (req, res) => {
    const { email, password ,username, role} = req.body;

    // Check if email or password are missing
    if (!email || !password) {
        return res.status(400).json({
            code:400,
            message: 'Email and password are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                code:400,
                message: 'Email already taken' });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({
                code:400,
                message: 'Username already taken' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and store the new user
        const newUser = await User.create({ email, password: hashedPassword, username, role });

        // Optionally create a token to auto-login upon sign-up
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            code: 200,
            message: 'User created', token });
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
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            code: 200,
            message:"Log in success",
            token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
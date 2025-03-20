const TrafficLog = require('../models/trafficLogModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Device = require("../models/deviceModel");
const Card = require('../models/rfidCardModel');


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
         const user = await User.findByPk(userId, {
             attributes: { exclude: ['password'] } // Excludes the password field
         });
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

exports.getPersonalDetail = async (req, res) => {
    const user_id = req.user.user_id;
    try{
        const user = await User.findByPk(user_id, {
            attributes: { exclude: ['password'] } // Excludes the password field
        });
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

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    const { user } = req;
    console.log(user);
    if (parseInt(userId, 10) === user.user_id) {
        return res.status(400).json({
            message: 'You cannot delete your own account.',
        });
    }


    try {
        // Find the user by primary key
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: 'User not found.',
            });
        }

        // Check if the user has associated RFID cards
        const cards = await Card.findAll({ where: { user_id: userId } });
        if (cards.length > 0) {
            return res.status(400).json({
                code: 400,
                message: 'User cannot be deleted while having associated RFID cards.',
            });
        }

        // Delete the user
        await user.destroy();

        res.status(200).json({
            code: 200,
            message: 'User deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting User:', error);
        res.json({
            code: 500,
            error: 'Failed to delete user.',
        });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params; // Get user ID from URL parameters
    const { email, password, username, role, first_name, last_name } = req.body; // Fields to update

    try {
        // Find the user by their ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: 'User not found',
            });
        }

        // Check if the new email is already taken by another user
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.json({
                    code: 400,
                    message: 'Email already taken',
                });
            }
        }

        // Check if the new username is already taken by another user
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                return res.json({
                    code: 400,
                    message: 'Username already taken',
                });
            }
        }

        // Update the user's details
        const updatedFields = {};
        if (email) updatedFields.email = email;
        if (username) updatedFields.username = username;
        if (role) updatedFields.role = role;
        if (first_name) updatedFields.first_name = first_name;
        if (last_name) updatedFields.last_name = last_name;

        // If a new password is provided, hash it before updating
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        // Save the updated fields
        await user.update(updatedFields);

        res.json({
            code: 200,
            message: 'User updated successfully',
            user: {
                id: user.user_id,
                email: user.email,
                username: user.username,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: 'Server error',
        });
    }
};
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
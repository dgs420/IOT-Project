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

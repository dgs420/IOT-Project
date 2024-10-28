const TrafficLog = require('../models/userLogModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');


exports.getAllUsers = async (req, res) => {
    try {
      const logs = await User.findAll();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  };
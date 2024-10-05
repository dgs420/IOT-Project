const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the Log model (equivalent to a table in MySQL)
const Log = sequelize.define('Log', {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.ENUM('locked', 'unlocked'),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

module.exports = Log;

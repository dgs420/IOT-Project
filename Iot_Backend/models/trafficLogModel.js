const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RfidCard = require('./rfidCardModel');

const TrafficLog = sequelize.define('TrafficLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  card_id: {
    type: DataTypes.INTEGER,
    references: {
      model: RfidCard,
      key: 'card_id',
    },
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  action: {
    type: DataTypes.ENUM('enter', 'exit'),
    allowNull: false,
  },
});

module.exports = TrafficLog;

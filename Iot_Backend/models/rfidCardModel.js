const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehicle = require('./vehicleModel');

const RfidCard = sequelize.define('rfid_card', {
  card_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  card_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('parking', 'exited'),
    allowNull: false,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Vehicle,
      key: 'vehicle_id',
    },
  },
  
},{
  timestamps: false,
});

RfidCard.getCardByNumber = async function(card_number) {
  return await RfidCard.findOne({
    where: {
      card_number: card_number
    }
  });
};

module.exports = RfidCard;

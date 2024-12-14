const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const TrafficLog = require('./trafficLogModel');


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
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'user_id',
        },
    },
    status: {
        type: DataTypes.ENUM('parking', 'exited'),
        allowNull: false,
    },
    vehicle_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    vehicle_type: {
        type: DataTypes.ENUM('car', 'bike', 'others'),
    },

}, {
    timestamps: false,
});


// RfidCard.belongsTo(User, { foreignKey: 'user_id' });

// TrafficLog.belongsTo(RfidCard, { foreignKey: 'card_id' });

RfidCard.getCardByNumber = async function (card_number) {
    return await RfidCard.findOne({
        where: {
            card_number: card_number
        }
    });
};

module.exports = RfidCard;

const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const TrafficLog = require('./trafficLogModel');


const Request = sequelize.define('request', {
    request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'user_id',
        },
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved','rejected'),
        defaultValue: 'pending',
        allowNull: false,
    },
    vehicle_number: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
    },
    vehicle_type: {
        type: DataTypes.ENUM('car', 'bike', 'others'),
    },
    name:{
        type: DataTypes.STRING,
    },
    contact_number:{
        type: DataTypes.STRING,
    },
    delivery_address: {
        type: DataTypes.STRING,
    },
    // created_at: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    // }

}, {
    timestamps: false,
});

// RfidCard.belongsTo(User, { foreignKey: 'user_id' });

// TrafficLog.belongsTo(RfidCard, { foreignKey: 'card_id' });



module.exports = Request;

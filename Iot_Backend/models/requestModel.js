const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const VehicleType = require('./vehicleTypeModel');

const Request = sequelize.define('request', {
    request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id',
        },
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved','rejected'),
        defaultValue: 'pending',
        allowNull: false,
    },
    vehicle_plate: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
    },
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        references: {
            model: VehicleType,
            key: 'vehicle_type_id',
        },
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
    },
    contact_number:{
        type: DataTypes.STRING,
    },
    reason:{
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
    timestamps: true, // Enable automatic timestamp fields
    createdAt: 'created_at', // Custom name for createdAt
    updatedAt: 'updated_at',
});

// RfidCard.belongsTo(User, { foreignKey: 'user_id' });

// TrafficLog.belongsTo(RfidCard, { foreignKey: 'card_id' });



module.exports = Request;

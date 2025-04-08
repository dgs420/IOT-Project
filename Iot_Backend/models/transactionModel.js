const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/userModel');
const ParkingSession = require('../models/parkingSessionModel')
const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('cash','rfid_balance', 'stripe'),
        allowNull: false
    },
    payment_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    transaction_type: {
        type: DataTypes.ENUM('top-up', 'fee'),
        allowNull: false
    },
    session_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ParkingSession,
            key: 'session_id',
        },
    },
    balance:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW}
}, {
    tableName: 'transactions',
    timestamps: true, // Enable automatic timestamp fields
    underscored: true
});

module.exports = Transaction;
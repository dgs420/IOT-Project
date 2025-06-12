const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Notification = sequelize.define('Notification', {
    notification_id: {
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
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type:{
        type: DataTypes.ENUM('info', 'success', 'fail', 'warning'),
        defaultValue:'info',
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'notifications',
    timestamps: false
});

module.exports = Notification;
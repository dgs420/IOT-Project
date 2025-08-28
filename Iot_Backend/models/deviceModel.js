const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Device = sequelize.define('device', {
    device_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    embed_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('entry', 'exit', 'both'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('online', 'offline'),
        defaultValue: 'offline',
    },
    last_seen: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    
}, {
    timestamps: false,
    // underscored: true
    // timestamps: true, 
    // createdAt: "created_at", 
    // updatedAt: "updated_at",
});

module.exports = Device;

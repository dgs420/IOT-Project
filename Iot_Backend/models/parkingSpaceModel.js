const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const VehicleType = require('./vehicleTypeModel');

const ParkingSpace = sequelize.define('ParkingSpace', {
    space_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VehicleType,
            key: 'vehicle_type_id'
        }
    },
    total_spaces: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    occupied_spaces: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'parking_spaces',
    timestamps: true,
    underscored: true
});

module.exports = ParkingSpace;

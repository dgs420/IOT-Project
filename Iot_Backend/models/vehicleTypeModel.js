const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VehicleType = sequelize.define('vehicle_type', {
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    vehicle_type_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fee_per_hour: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'vehicle_types',
    timestamps: true,
});

module.exports = VehicleType;
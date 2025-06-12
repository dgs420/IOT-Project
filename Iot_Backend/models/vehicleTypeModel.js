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
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fee_per_hour: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
    tableName: 'vehicle_types',
    timestamps: true,
    underscored: true
});

module.exports = VehicleType;
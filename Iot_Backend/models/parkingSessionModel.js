const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RfidCard = require('./rfidCardModel');

const TrafficLog = sequelize.define('parking_session', {
    session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    card_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rfid_cards',
            key: 'card_id',
        },
        allowNull: true,
        index: true
    },
    device_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'devices',
            key: 'device_id',
        },
        index: true
    },
    entry_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
        exit_time: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                exitTimeRequired() {
                    if (this.status === 'completed' && !this.exit_time) {
                        throw new Error('exit_time must be set when session is completed');
                    }
                }
            }
        },
    status: {
        type: DataTypes.ENUM('active', 'completed'),
        allowNull: false,
        defaultValue: 'active',
        index: true
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'exempt', 'failed'),
        allowNull: false,
        defaultValue: 'unpaid'
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
},{
    timestamps: false,
});

module.exports = TrafficLog;

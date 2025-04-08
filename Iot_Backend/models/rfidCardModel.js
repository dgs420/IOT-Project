const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const TrafficLog = require('./trafficLogModel');
const Vehicle = require('./vehicleModel');
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
            model: User,
            key: 'user_id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW}
    // status: {
    //     type: DataTypes.ENUM('parking', 'exited','blocked'),
    //     allowNull: false,
    // },
    // vehicle_number: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true
    // },
    // vehicle_type: {
    //     type: DataTypes.ENUM('car', 'bike', 'others'),
    // }

}, {
    timestamps: true, 
    underscored: true
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

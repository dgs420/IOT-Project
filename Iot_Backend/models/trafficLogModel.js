const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RfidCard = require("./rfidCardModel");

const TrafficLog = sequelize.define(
  "traffic_log",
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "rfid_cards",
        key: "card_id",
      },
      onDelete: "SET NULL",
      allowNull: true,
    },
    device_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "devices",
        key: "device_id",
      },
      onDelete: "SET NULL", // Set to NULL when the device is deleted
      allowNull: true,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("enter", "exit", "admin enter", "admin exit"),
      allowNull: false,
    },
  },
  {   
    timestamps: false
    // timestamps: true, // Enable automatic timestamp fields
    // createdAt: "created_at", // Custom name for createdAt
    // updatedAt: "updated_at",
  }
);

module.exports = TrafficLog;

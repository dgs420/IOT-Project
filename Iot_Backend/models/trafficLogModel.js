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
      onDelete: "SET NULL",
      allowNull: true,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("enter", "exit","exit-cash", "admin enter", "admin exit"),
      allowNull: false,
    },
    is_valid:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    details:{
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {   
    timestamps: false
    // timestamps: true, // Enable automatic timestamp fields
    // createdAt: "created_at", // Custom name for createdAt
    // updatedAt: "updated_at",
  }
);

module.exports = TrafficLog;

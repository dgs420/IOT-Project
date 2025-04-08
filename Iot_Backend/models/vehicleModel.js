const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const RfidCard = require("./rfidCardModel");
const VehicleType = require("./vehicleTypeModel");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    vehicle_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "rfid_cards",
        key: "card_id",
      },
    },
    vehicle_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VehicleType,
        key: "vehicle_type_id",
      },
    },
    status: {
        type: DataTypes.ENUM('parking', 'exited','blocked'),
        allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "vehicles",
    timestamps: true,
    underscored: true
  }
);

module.exports = Vehicle;

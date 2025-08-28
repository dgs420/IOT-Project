const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Vehicle = require("./vehicleModel");
const VehicleType = require("./vehicleTypeModel");
const RfidCard = require("./rfidCardModel");
const ParkingSession = sequelize.define(
  "parking_session",
  {
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Vehicle,
        key: "vehicle_id",
      },
      allowNull: true,

      onDelete: "SET NULL",
      index: true,
    },
    vehicle_plate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VehicleType,
        key: "vehicle_type_id",
      },
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: RfidCard,
        key: "card_id",
      },
      index: true,
    },
    is_guest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
          if (this.status === "completed" && !this.exit_time) {
            throw new Error("exit_time must be set when session is completed");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "completed"),
      allowNull: false,
      defaultValue: "active",
      index: true,
    },
    payment_status: {
      type: DataTypes.ENUM("unpaid", "paid", "exempt", "failed"),
      allowNull: false,
      defaultValue: "unpaid",
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = ParkingSession;

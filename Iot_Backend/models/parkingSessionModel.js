const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Vehicle = require("./vehicleModel");
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
    timestamps: true, // Enable automatic timestamp fields
    createdAt: "created_at", // Custom name for createdAt
    updatedAt: "updated_at",
  }
);

module.exports = ParkingSession;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RfidCard = require("./rfidCardModel");

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "user"),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Enable automatic timestamp fields
    createdAt: "created_at", // Custom name for createdAt
    updatedAt: "updated_at",
  }
);

module.exports = User;

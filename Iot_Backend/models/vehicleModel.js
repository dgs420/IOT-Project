const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
// const ParkingSession = require("./parkingSessionModel");
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

// Vehicle.beforeUpdate(async (vehicle, options) => {
//   if (vehicle.status === 'exited') {
//     const activeSession = await ParkingSession.findOne({
//       where: {
//         vehicle_id: vehicle.vehicle_id,
//         status: 'active',
//       },
//     });

//     if (activeSession) {
//       throw new Error('Cannot set vehicle to exited with an active parking session');
//     }
//   }
// });
module.exports = Vehicle;

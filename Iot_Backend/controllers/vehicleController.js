const RfidCard = require("../models/rfidCardModel");
const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const ParkingSession = require("../models/parkingSessionModel");
const sequelize = require("../config/database");

// const RfidCard=require("../models/rfidCardModel");

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: RfidCard,
          as: "rfid_card",
          attributes: ["card_number"],
        },
      ],
    });
    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found" });
    }

    res.status(200).json({
      code: 200,
      message: "All vehicles Successfully Fetched",
      info: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};

exports.getVehiclesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: RfidCard,
          as: "rfid_card",
          attributes: ["card_number"],
        },
      ],
      where: {
        user_id: userId,
      },
    });
    if (vehicles.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "User have not registered any vehicles.",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Vehicles Successfully Fetched",
      info: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};

exports.getYourVehicles = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const vehicles = await Vehicle.findAll({
      where: {
        user_id, // Filter by card IDs
      },
    });
    // if (vehicles.length === 0) {
    //   return res.status(404).json({
    //     code: 404,
    //     message: "You have not registered any Vehicles.",
    //   });
    // }

    res.status(200).json({
      code: 200,
      message: "Vehicles Successfully Fetched",
      info: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};

exports.getYourRecentVehicles = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const vehicles = await Vehicle.findAll({
      where: {
        user_id,
      },
      order: [["updated_at", "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      code: 200,
      message: "Vehicles Successfully Fetched",
      info: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};
exports.createVehicle = async (req, res) => {
  const { user_id, vehicle_number, vehicle_type_id, card_number } = req.body;
  const t = await sequelize.transaction();
  if (!user_id || !vehicle_number || !vehicle_type_id || !card_number) {
    return res
      .status(400)
      .json({ code: 400, message: "Missing required fields." });
  }
  try {
    const existingVehicle = await Vehicle.findOne({
      where: { vehicle_number },
      transaction: t,
    });

    if (existingVehicle) {
      await t.rollback();
      return res.json({
        code: 400,
        message: "This vehicle is already registered.",
      });
    }

    const existingCard = await RfidCard.findOne({
      where: { card_number: card_number },
      transaction: t,
    });

    if (existingCard) {
      await t.rollback();
      return res.json({
        code: 400,
        message: "This card is already registered",
      });
    }

    const newCard = await RfidCard.create(
      {
        card_number,
        user_id,
      },
      { transaction: t }
    );
    const newVehicle = await Vehicle.create(
      {
        user_id,
        vehicle_number,
        vehicle_type_id,
        status: "exited",
        card_id: newCard.card_id,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      code: 200,
      message: "Vehicle created successfully.",
      info: newVehicle,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating Vehicle:", error);
    res.json({
      code: 500,
      message: "Server error.",
    });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { vehicleId } = req.params;
  console.log(vehicleId);
  //todo
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        code: 404,
        message: "Vehicle not found.",
      });
    }

    const card = await RfidCard.findByPk(vehicle.card_id);
    const activeSession = await ParkingSession.findOne({
      where: {
        vehicle_id: vehicle.vehicle_id,
        status: "active",
      },
    });

    if (activeSession) {
      return res.status(400).json({
        code: 400,
        message: "Vehicle has active parking session.",
      });
    }

    await vehicle.destroy();
    if (card) {
      await card.destroy();
    }

    res.status(200).json({
      code: 200,
      message: "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting Vehicle:", error);
    res.json({
      code: 500,
      message: "Failed to delete Vehicle.",
    });
  }
};

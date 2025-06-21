const { Op } = require("sequelize");
const sequelize = require("../config/database");
const TrafficLog = require("../models/trafficLogModel");
const RfidCard = require("../models/rfidCardModel");
const Vehicle = require("../models/vehicleModel");
const Device = require("../models/deviceModel");

exports.fetchAllLogs = async () => {
  return await TrafficLog.findAll();
};

exports.fetchJoinedLogs = async ({ limit = 20, offset = 0, embed_id }) => {
  let query = `
    SELECT 
      traffic_logs.log_id,
      traffic_logs.card_id,
      traffic_logs.device_id,
      traffic_logs.time,
      traffic_logs.action,
      traffic_logs.is_valid,
      traffic_logs.details,

      rfid_cards.card_number,
      rfid_cards.user_id,

      vehicles.vehicle_number,
      vehicles.vehicle_type_id,

      devices.embed_id

    FROM traffic_logs
    LEFT JOIN rfid_cards ON traffic_logs.card_id = rfid_cards.card_id
    LEFT JOIN vehicles ON rfid_cards.card_id = vehicles.card_id
    LEFT JOIN devices ON traffic_logs.device_id = devices.device_id
  `;

  if (embed_id) {
    query += ` WHERE devices.embed_id = :embed_id `;
  }

  query += ` ORDER BY traffic_logs.time DESC LIMIT :limit OFFSET :offset;`;

  return await sequelize.query(query, {
    replacements: { embed_id, limit: Number(limit), offset: Number(offset) },
    type: sequelize.QueryTypes.SELECT,
  });
};

exports.fetchDetailedLogs = async ({
  page = 1,
  limit = 20,
  all = false,
  startDate,
  endDate,
  deviceId,
}) => {
  const whereCondition = {};

  if (startDate && endDate) {
    whereCondition.time = {
      [Op.between]: [
        new Date(new Date(startDate).setHours(0, 0, 0, 0)),
        new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      ],
    };
  } else if (startDate) {
    whereCondition.time = {
      [Op.gte]: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
    };
  } else if (endDate) {
    whereCondition.time = {
      [Op.lte]: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  if (deviceId) {
    const device = await Device.findByPk(deviceId);
    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found.`);
    }
    whereCondition.device_id = deviceId;
  }

  const queryOptions = {
    where: whereCondition,
    include: [
      {
        model: RfidCard,
        include: [
          {
            model: Vehicle,
            attributes: ["user_id", "vehicle_number", "vehicle_type_id"],
          },
        ],
      },
      {
        model: Device,
        attributes: ["embed_id"],
      },
    ],
    order: [["time", "DESC"]],
  };

  if (all === "true") {
    const logs = await TrafficLog.findAll(queryOptions);
    return { logs };
  } else {
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
    return await TrafficLog.findAndCountAll(queryOptions);
  }
};

exports.calculateHourlyTraffic = async () => {
  const logs = await TrafficLog.findAll({ where: { is_valid: true } });

  const hourRanges = [
    "0:00-2:00",
    "2:00-4:00",
    "4:00-6:00",
    "6:00-8:00",
    "8:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
    "18:00-20:00",
    "20:00-22:00",
    "22:00-24:00",
  ];

  const trafficData = hourRanges.map((range) => ({
    range,
    enter: 0,
    exit: 0,
    days: new Set(),
  }));

  logs.forEach((log) => {
    const date = new Date(log.time);
    const hour = date.getHours();
    const rangeIndex = Math.floor(hour / 2);
    const logDate = date.toISOString().split("T")[0];

    if (log.action === "enter") trafficData[rangeIndex].enter++;
    else if (log.action === "exit") trafficData[rangeIndex].exit++;

    trafficData[rangeIndex].days.add(logDate);
  });

  trafficData.forEach((interval) => {
    const dayCount = interval.days.size;
    if (dayCount > 0) {
      interval.enter = Math.round(interval.enter / dayCount);
      interval.exit = Math.round(interval.exit / dayCount);
    }
    delete interval.days;
  });

  return trafficData;
};

exports.calculateWeeklyTraffic = async (start_date) => {
  const baseDate = start_date ? new Date(start_date) : new Date();
  const dayOfWeek = baseDate.getDay(); // Sunday = 0
  const sunday = new Date(baseDate);
  sunday.setDate(sunday.getDate() - dayOfWeek);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  const startOfWeek = new Date(sunday.setHours(0, 0, 0, 0));
  const endOfWeek = new Date(saturday.setHours(23, 59, 59, 999));

  const trafficData = await TrafficLog.findAll({
    where: {
      is_valid: true,
      time: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
    attributes: [
      [sequelize.fn("DAYOFWEEK", sequelize.col("time")), "day"],
      "action",
      [sequelize.fn("COUNT", sequelize.col("log_id")), "count"],
    ],
    group: ["day", "action"],
    order: [[sequelize.fn("DAYOFWEEK", sequelize.col("time")), "ASC"]],
  });

  const result = [
    { day: "Sun", enter: 0, exit: 0 },
    { day: "Mon", enter: 0, exit: 0 },
    { day: "Tue", enter: 0, exit: 0 },
    { day: "Wed", enter: 0, exit: 0 },
    { day: "Thu", enter: 0, exit: 0 },
    { day: "Fri", enter: 0, exit: 0 },
    { day: "Sat", enter: 0, exit: 0 },
  ];

  trafficData.forEach((log) => {
    const dayIndex = parseInt(log.get("day")) - 1;
    if (log.get("action") === "enter") {
      result[dayIndex].enter += log.get("count");
    } else if (log.get("action") === "exit") {
      result[dayIndex].exit += log.get("count");
    }
  });

  return result;
};

exports.fetchTrafficByDate = async (date) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // 00:00:00
  const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // 23:59:59

  // Query traffic logs for the specific day
  const trafficLogs = await TrafficLog.findAll({
    where: {
      // is_valid: true,
      time: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
    order: [["time", "ASC"]],
  });

  return trafficLogs;
};

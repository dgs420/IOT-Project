const { Op } = require("sequelize");
const ParkingSession = require("../models/parkingSessionModel");
const Vehicle = require("../models/vehicleModel");

exports.getAllSessions = async () => {
  const sessions = await ParkingSession.findAll({
    include: [{ model: Vehicle }],
  });
  return sessions;
};

exports.getTransactionSession = async (userId, sessionId) => {
  const session = await ParkingSession.findOne({
    where: {
      session_id: sessionId,
    },
    include: [
      {
        model: Vehicle,
        where: {
          user_id: userId,
        },
        required: true,
      },
    ],
  });

  if (!session) {
    const error = new Error("Session not found");
    error.code = 400;
    throw error;
  }

  return session;
};

exports.getTransactionSessionAdmin = async (sessionId) => {
  const session = await ParkingSession.findOne({
    where: {
      session_id: sessionId,
    },
    include: [
      {
        model: Vehicle,
      },
    ],
  });

  if (!session) {
    const error = new Error("Session not found");
    error.code = 400;
    throw error;
  }

  return session;
};


exports.getPaginatedsSessions = async (query, userId) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    paymentStatus,
    sortField = "entry_time",
    sortOrder = "DESC",
  } = query;
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  // const offset = (page - 1) * limit;
  const offset = Math.max((parsedPage - 1) * parsedLimit, 0);
  const whereClause = {};

  if (status && status !== "all") {
    whereClause.status = status;
  }

  if (paymentStatus && paymentStatus !== "all") {
    whereClause.payment_status = paymentStatus;
  }

  const include = [
    {
      model: Vehicle,
      required: false,
      where: userId
        ? {
            user_id: userId,
          }
        : undefined,
    },
  ];

  // if (search && !isNaN(search)) {
  //   whereClause.session_id = {
  //     [Op.or]: [{ [Op.like]: `%${search}%` }, parseInt(search)],
  //   };
  // }

  if (search) {
    const isNumeric = !isNaN(search);
    whereClause[Op.or] = [
      {
        "$Vehicle.vehicle_plate$": {
          [Op.like]: `%${search}%`,
        },
      },
      ...(isNumeric
        ? [
            {
              session_id: {
                [Op.or]: [parseInt(search), { [Op.like]: `%${search}%` }],
              },
            },
          ]
        : []),
    ];
  }

  const validSortFields = [
    "entry_time",
    "exit_time",
    "fee",
    "status",
    "payment_status",
  ];
  const sanitizedSortField = validSortFields.includes(sortField)
    ? sortField
    : "entry_time";
  const sanitizedSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { rows: sessions, count } = await ParkingSession.findAndCountAll({
    where: whereClause,
    include,
    order: [[sanitizedSortField, sanitizedSortOrder]],
    limit: parsedLimit,
    offset: offset,
  });

  return {
    sessions,
    pagination: {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit),
    },
  };
};

exports.getUserSessions = async (userId) => {
  const sessions = await ParkingSession.findAll({
    include: [
      {
        model: Vehicle,
        where: { user_id: userId },
        attributes: ["vehicle_plate"],
      },
    ],
  });
  return sessions;
};

exports.getYourSessions = async (userId) => {
  const sessions = await ParkingSession.findAll({
    include: [
      {
        model: Vehicle,
        where: { user_id: userId },
        attributes: ["vehicle_plate"],
      },
    ],
  });
  return sessions;
};

exports.closeActiveSession = async (sessionId) => {
  const session = await ParkingSession.findByPk(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.code = 400;
    throw error;
  }
  await session.update({ status: "completed" });
  return session;
};

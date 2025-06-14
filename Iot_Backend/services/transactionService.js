const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Transaction = require("../models/transactionModel");
const Device = require("../models/deviceModel");

async function getTransactionsWithSummary(query) {
  const {
    deviceId,
    embedId,
    paymentMethod,
    transactionType,
    startDate,
    endDate,
    date,
    page = 1,
    limit = 10,
    sortField = "created_at",
    sortOrder = "DESC",
  } = query;

  const whereConditions = {};
  const dateConditions = {};

  if (deviceId) {
    whereConditions.device_id = parseInt(deviceId);
  }

  if (embedId) {
    const device = await Device.findOne({ where: { embed_id: embedId } });
    if (device) {
      whereConditions.device_id = device.device_id;
    } else {
      // If embedId not found, return early with no data
      return {
        transactions: [],
        count: 0,
        summary: {
          total_transactions: 0,
          total_amount: 0,
          total_topups: 0,
          total_fees: 0,
        },
      };
    }
  }

  if (paymentMethod) {
    whereConditions.payment_method = paymentMethod;
  }

  if (transactionType) {
    whereConditions.transaction_type = transactionType;
  }

  if (date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    dateConditions.created_at = { [Op.between]: [startOfDay, endOfDay] };
  } else if (startDate || endDate) {
    const range = {};
    if (startDate) range[Op.gte] = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range[Op.lte] = end;
    }
    dateConditions.created_at = range;
  }

  const finalWhereConditions = { ...whereConditions, ...dateConditions };

  const validSortFields = [
    "created_at",
    "amount",
    "payment_method",
    "status",
    "transaction_type",
    "device_id",
  ];
  const sanitizedSortField = validSortFields.includes(sortField)
    ? sortField
    : "created_at";
  const sanitizedSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  const offset = (page - 1) * limit;

  const { count, rows: transactions } = await Transaction.findAndCountAll({
    where: finalWhereConditions,
    attributes: {
      include: [
        [
          sequelize.Sequelize.literal(`(
            SELECT embed_id FROM Devices AS device
            WHERE device.device_id = Transaction.device_id
          )`),
          "embed_id",
        ],
      ],
    },
    order: [[sanitizedSortField, sanitizedSortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    raw: true,
  });

  const summaryResult = await Transaction.findAll({
    where: finalWhereConditions,
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("transaction_id")), "total_transactions"],
      [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"],
      [
        sequelize.fn(
          "SUM",
          sequelize.literal("CASE WHEN transaction_type = 'top-up' THEN amount ELSE 0 END")
        ),
        "total_topups",
      ],
      [
        sequelize.fn(
          "SUM",
          sequelize.literal("CASE WHEN transaction_type = 'fee' THEN amount ELSE 0 END")
        ),
        "total_fees",
      ],
    ],
    raw: true,
  });

  return {
    transactions,
    count,
    summary: summaryResult[0],
    pagination: {
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit),
    },
    filters: {
      deviceId: deviceId || null,
      paymentMethod: paymentMethod || null,
      transactionType: transactionType || null,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
        specificDate: date || null,
      },
    },
  };
}

async function getAllTransactionsWithoutPagination(query) {
  const {
    deviceId,
    embedId,
    paymentMethod,
    transactionType,
    startDate,
    endDate,
    date,
    sortField = "created_at",
    sortOrder = "DESC",
  } = query;

  const whereConditions = {};
  const dateConditions = {};

  if (deviceId) {
    whereConditions.device_id = parseInt(deviceId);
  }

  if (embedId) {
    const device = await Device.findOne({ where: { embed_id: embedId } });
    if (device) whereConditions.device_id = device.device_id;
  }

  if (paymentMethod) {
    whereConditions.payment_method = paymentMethod;
  }

  if (transactionType) {
    whereConditions.transaction_type = transactionType;
  }

  if (date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    dateConditions.created_at = {
      [Op.between]: [startOfDay, endOfDay],
    };
  } else if (startDate || endDate) {
    const dateRange = {};
    if (startDate) dateRange[Op.gte] = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateRange[Op.lte] = end;
    }
    dateConditions.created_at = dateRange;
  }

  const finalWhere = { ...whereConditions, ...dateConditions };

  const validSortFields = [
    "created_at",
    "amount",
    "payment_method",
    "status",
    "transaction_type",
    "device_id",
  ];
  const sanitizedSortField = validSortFields.includes(sortField)
    ? sortField
    : "created_at";
  const sanitizedSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  const transactions = await Transaction.findAll({
    where: finalWhere,
    attributes: {
      include: [
        [
          sequelize.Sequelize.literal(`(
          SELECT embed_id
          FROM Devices AS device
          WHERE device.device_id = Transaction.device_id
        )`),
          "embed_id",
        ],
      ],
    },
    order: [[sanitizedSortField, sanitizedSortOrder]],
  });

  return transactions;
}


module.exports = { getTransactionsWithSummary, getAllTransactionsWithoutPagination };

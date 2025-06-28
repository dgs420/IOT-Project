const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Transaction = require("../models/transactionModel");
const Device = require("../models/deviceModel");

exports.getAllTransactions = async () => {
  return await Transaction.findAll();
};

exports.getUserTransactions = async (user_id) => {
  return await Transaction.findAll({
    where: { user_id },
    order: [["createdAt", "DESC"]],
  });
};

exports.getRecentTransactions = async (user_id, limit = 5) => {
  return await Transaction.findAll({
    where: { user_id },
    order: [["createdAt", "DESC"]],
    limit,
  });
};

exports.getTransactionSummary = async () => {
  const [data] = await sequelize.query(`
    SELECT transaction_type, payment_method, SUM(amount) as total
    FROM transactions
    WHERE status = 'completed'
    GROUP BY transaction_type, payment_method
  `);
  return data;
};

exports.getDeviceCashFlow = async () => {
  const [data] = await Transaction.sequelize.query(`
      SELECT
        d.device_id,
        d.embed_id,
        d.name,
        COUNT(t.transaction_id) AS transaction_count,
        SUM(t.amount) AS cash_total
      FROM transactions t
      JOIN devices d ON t.device_id = d.device_id
      WHERE t.payment_method = 'cash' AND t.status = 'completed'
      GROUP BY d.device_id, d.embed_id, d.name
      ORDER BY cash_total DESC
    `);

  return data;
};

exports.getDeviceCashByDay = async (device_id, from, to) => {
  const [data] = await sequelize.query(
    `
    SELECT DATE(created_at) as date, SUM(amount) as cash_total
    FROM transactions
    WHERE 
      device_id = :device_id
      AND payment_method = 'cash'
      AND status = 'completed'
      AND DATE(created_at) BETWEEN :from AND :to
    GROUP BY DATE(created_at)
    ORDER BY date ASC
    `,
    {
      replacements: { device_id, from, to },
    }
  );
  return data;
};

exports.getDailyRevenue = async (from, to) => {
  const [data] = await sequelize.query(
    `
    SELECT DATE(created_at) as date, SUM(amount) as total
    FROM transactions
    WHERE status = 'completed' AND created_at BETWEEN :from AND :to
    GROUP BY DATE(created_at)
    ORDER BY date ASC
    `,
    {
      replacements: { from, to },
    }
  );
  return data;
};

exports.getTransactionsWithSummary = async (query) => {
  const {
    deviceId,
    embedId,
    paymentMethod,
    transactionType,
    userId,
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

  if (userId) {
    whereConditions.user_id = parseInt(userId);
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
      [
        sequelize.fn("COUNT", sequelize.col("transaction_id")),
        "total_transactions",
      ],
      [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"],
      [
        sequelize.fn(
          "SUM",
          sequelize.literal(
            "CASE WHEN transaction_type = 'top-up' THEN amount ELSE 0 END"
          )
        ),
        "total_topups",
      ],
      [
        sequelize.fn(
          "SUM",
          sequelize.literal(
            "CASE WHEN transaction_type = 'fee' THEN amount ELSE 0 END"
          )
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
};

exports.getAllTransactionsWithoutPagination = async (query) => {
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
        [
          sequelize.Sequelize.literal(`(
          SELECT name FROM Devices AS device
          WHERE device.device_id = Transaction.device_id
          )`),
          "device_name",
        ],
      ],
    },
    order: [[sanitizedSortField, sanitizedSortOrder]],
  });

  return transactions;
};

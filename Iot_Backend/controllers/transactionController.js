const Transaction = require("../models/transactionModel");
const Device = require("../models/deviceModel");
const sequelize = require("../config/database");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const transactionService = require("../services/transactionService");

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json({
      code: 200,
      message: "Alltransaction found",
      info: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getYourTransactions = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const transactions = await Transaction.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      message: "Recent transaction found",
      info: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const transactions = await Transaction.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      code: 200,
      message: "Recent transaction found",
      info: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const [data] = await Transaction.sequelize.query(`
      SELECT transaction_type, payment_method, SUM(amount) as total
      FROM transactions
      WHERE status = 'completed'
      GROUP BY transaction_type, payment_method
    `);

    res.status(200).json({ code: 200, message: "Summary fetched", info: data });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getDeviceCashFlow = async (req, res) => {
  try {
    const [data] = await Transaction.sequelize.query(`
      SELECT
        d.device_id,
        d.embed_id,
        d.location,
        COUNT(t.transaction_id) AS transaction_count,
        SUM(t.amount) AS cash_total
      FROM transactions t
      JOIN devices d ON t.device_id = d.device_id
      WHERE t.payment_method = 'cash' AND t.status = 'completed'
      GROUP BY d.device_id, d.embed_id, d.location
      ORDER BY cash_total DESC
    `);

    res.status(200).json({
      code: 200,
      message: "Cash per device with device info",
      info: data,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getDeviceTransactions = async (req, res) => {
  try {
    const {
      deviceId,
      paymentMethod,
      startDate,
      endDate,
      date,
      page = 1,
      limit = 10,
      sortField = "created_at",
      sortOrder = "DESC",
    } = req.query;

    if (!deviceId) {
      return res
        .status(400)
        .json({ code: 400, message: "Device ID is required" });
    }

    const whereClause = [`t.device_id = ${parseInt(deviceId)}`];

    if (paymentMethod) {
      whereClause.push(`t.payment_method = '${paymentMethod}'`);
    }

    if (date) {
      whereClause.push(`DATE(t.created_at) = '${date}'`);
    } else if (startDate && endDate) {
      whereClause.push(`t.created_at BETWEEN '${startDate}' AND '${endDate}'`);
    } else if (startDate) {
      whereClause.push(`t.created_at >= '${startDate}'`);
    } else if (endDate) {
      whereClause.push(`t.created_at <= '${endDate}'`);
    }

    const whereCondition =
      whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    const offset = (page - 1) * limit;

    const validSortFields = [
      "created_at",
      "amount",
      "payment_method",
      "status",
      "transaction_type",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const sanitizedSortField = validSortFields.includes(sortField)
      ? sortField
      : "created_at";
    const sanitizedSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    const [countResult] = await Transaction.sequelize.query(`
      SELECT COUNT(*) as total
      FROM transactions t
      ${whereCondition}
    `);

    const total = parseInt(countResult[0].total);
    const totalPages = Math.ceil(total / limit);

    const [transactions] = await Transaction.sequelize.query(`
      SELECT 
        t.*,
        d.embed_id,
        d.location,
        u.email as user_email
      FROM transactions t
      JOIN devices d ON t.device_id = d.device_id
      LEFT JOIN users u ON t.user_id = u.user_id
      ${whereCondition}
      ORDER BY t.${sanitizedSortField} ${sanitizedSortOrder}
      LIMIT ${limit} OFFSET ${offset}
    `);

    res.status(200).json({
      code: 200,
      message: "Device transactions retrieved successfully",
      info: transactions,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching device transactions:", error);
    res.status(500).json({ code: 500, message: error.message });
  }
};

//   try {
//     const [data] = await Transaction.sequelize
//       .query(`SELECT device_id, COUNT(*) as transaction_count, SUM(amount) as cash_total
//     FROM transactions
//     WHERE payment_method = 'cash' AND status = 'completed'
//     GROUP BY device_id`);

//     res.status(200).json({ code: 200, message: "Cash per device", info: data });
//   } catch (error) {
//     res.status(500).json({ code: 500, message: error.message });
//   }
// };

exports.getDailyRevenue = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ code: 400, message: "Missing date range" });
  }

  try {
    const [data] = await Transaction.sequelize.query(
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

    res.status(200).json({ code: 200, message: "Daily revenue", info: data });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getAllTransactionsORM = async (req, res) => {
  try {
    const {
      transactions,
      count,
      summary,
      pagination,
      filters,
    } = await transactionService.getTransactionsWithSummary(req.query);

    res.status(200).json({
      code: 200,
      message: "Transactions retrieved successfully",
      info: transactions,
      pagination: {
        total: count,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
        limit: pagination.limit,
        hasNextPage: pagination.currentPage < pagination.totalPages,
        hasPrevPage: pagination.currentPage > 1,
      },
      summary: {
        totalTransactions: parseInt(summary?.total_transactions) || 0,
        totalAmount: parseFloat(summary?.total_amount) || 0,
        totalTopups: parseFloat(summary?.total_topups) || 0,
        totalFees: parseFloat(summary?.total_fees) || 0,
      },
      filters,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      code: 500,
      message: "Failed to retrieve transactions",
      info: error.message,
    });
  }
};

exports.getDeviceCashByDay = async (req, res) => {
  const device_id = req.query.device_id;
  const from = req.query.from || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const to = req.query.to || from;

  if (!device_id) {
    return res.status(400).json({ code: 400, message: "Missing device_id" });
  }

  try {
    const [data] = await Transaction.sequelize.query(
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

    res
      .status(200)
      .json({ code: 200, message: "Cash flow by day", info: data });
  } catch (error) {
    console.error("Error fetching cash by day:", error);
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.exportTransactionsExcel = async (req, res) => {
  try {
    const { ...filters } = req.query;

    const transactions = await transactionService.getAllTransactionsWithoutPagination(filters);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: "ID", key: "transaction_id", width: 10 },
      { header: "Device ID", key: "device_id", width: 10 },
      { header: "Embed ID", key: "embed_id", width: 15 },
      { header: "Type", key: "transaction_type", width: 10 },
      { header: "Method", key: "payment_method", width: 10 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "Created At", key: "created_at", width: 20 },
    ];

    transactions.forEach((tx) => {
      worksheet.addRow({
        ...tx.dataValues,
        embed_id: tx.Device?.embed_id || null,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export Excel error:", err);
    res
      .status(500)
      .json({ message: "Failed to export Excel", error: err.message });
  }
};

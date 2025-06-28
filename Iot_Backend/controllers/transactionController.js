const ExcelJS = require("exceljs");
const transactionService = require("../services/transactionService");

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
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
    const transactions = await transactionService.getUserTransactions(user_id);

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
    const transactions = await transactionService.getRecentTransactions(
      user_id
    );

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
    const summary = await transactionService.getTransactionSummary();

    res
      .status(200)
      .json({ code: 200, message: "Summary fetched", info: summary });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getDeviceCashFlow = async (req, res) => {
  try {
    const data = await transactionService.getDeviceCashFlow();

    res.status(200).json({
      code: 200,
      message: "Cash per device with device info",
      info: data,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getDailyRevenue = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ code: 400, message: "Missing date range" });
  }

  try {
    const data = await transactionService.getDailyRevenue(from, to);

    res.status(200).json({ code: 200, message: "Daily revenue", info: data });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

exports.getAllTransactionsORM = async (req, res) => {
  try {
    const { transactions, count, summary, pagination, filters } =
      await transactionService.getTransactionsWithSummary(req.query);

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
    const data = await transactionService.getDeviceCashByDay(
      device_id,
      from,
      to
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

    const transactions =
      await transactionService.getAllTransactionsWithoutPagination(filters);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: "ID", key: "transaction_id", width: 10 },
      // { header: "Device ID", key: "device_id", width: 10 },
      { header: "Device ID", key: "embed_id", width: 15 },
      { header: "Device Name", key: "device_name", width: 15 },
      { header: "Type", key: "transaction_type", width: 10 },
      { header: "Method", key: "payment_method", width: 10 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "Created At", key: "created_at", width: 20 },
    ];

    transactions.forEach((tx) => {
      worksheet.addRow({
        ...tx.dataValues,
        embed_id: tx.dataValues.embed_id || null || null,
        device_name: tx.dataValues.device_name || null || null,
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

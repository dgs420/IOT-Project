const trafficLogService = require("../services/trafficLogService");

// Get all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await trafficLogService.fetchAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve logs" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await trafficLogService.fetchJoinedLogs(req.query);
    res.status(200).json({
      code: 200,
      message: "Logs fetched successfully",
      info: logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Failed to fetch logs",
      error: error.message,
    });
  }
};

exports.getDetailedLogs = async (req, res) => {
  try {
    const result = await trafficLogService.fetchDetailedLogs(req.query);
    const { page = 1, limit = 20, all } = req.query;

    if (all === "true") {
      return res.status(200).json({
        code: 200,
        message: "All logs fetched successfully",
        info: result,
      });
    } else {
      // if (result.rows.length === 0) {
      //   return res.status(404).json({
      //     code: 404,
      //     message: "No logs found for the given criteria.",
      //   });
      // }
      const totalPages = Math.ceil(result.count / limit);
      const currentPage = parseInt(page);

      return res.status(200).json({
        code: 200,
        message: "Logs fetched successfully",
        info: result.rows,
        // pagination: {
        //   currentPage: parseInt(page),
        //   totalPages: Math.ceil(result.count / limit),
        //   totalRecords: result.count,
        // },
        pagination: {
          total: result.count,
          totalPages,
          currentPage,
          limit: parseInt(limit),
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching detailed logs:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getTrafficByHour = async (req, res) => {
  try {
    const data = await trafficLogService.calculateHourlyTraffic();
    res.status(200).json({
      code: 200,
      message: "Data fetched successfully",
      info: data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Failed to calculate average traffic by hour",
      error: error.message,
    });
  }
};

exports.getTrafficByWeek = async (req, res) => {
  try {
    const { start_date } = req.query;
    const data = await trafficLogService.calculateWeeklyTraffic(start_date);

    res.status(200).json({
      code: 200,
      message: "Data fetched successfully",
      info: data,
    });
  } catch (error) {
    console.error("Error fetching traffic log data by week:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getTrafficByDay = async (req, res) => {
  try {
    let { date } = req.query;

    // If no date is provided, default to the current date
    const currentDate = date ? new Date(date) : new Date();

    // Query traffic logs for the specific day
    const trafficLogs = await trafficLogService.fetchTrafficByDate(currentDate);

    // if (trafficLogs.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No traffic logs found for the specified day." });
    // }

    // Return the logs for the day
    res.status(200).json({
      code: 2000,
      message: "Data fetched successfully",
      info: trafficLogs,
    });
  } catch (error) {
    console.error("Error fetching traffic logs for the specific day:", error);
    res
      .status(500)
      .json({ code: 500, message: "Server error", error: error.message });
  }
};

// exports.getTrafficByWeek = async (req, res) => {
//   try {
//     let { start_date } = req.query;

//     // Parse the start_date (Sunday), default to current date if not provided
//     const currentDate = start_date ? new Date(start_date) : new Date();
//     const dayOfWeek = currentDate.getDay();
//     const sunday = new Date(currentDate);
//     sunday.setDate(sunday.getDate() - dayOfWeek); // Move back to Sunday
//     const saturday = new Date(sunday);
//     saturday.setDate(sunday.getDate() + 6); // Move forward to Saturday

//     // Set time to 00:00:00 for Sunday start and 23:59:59 for Saturday end
//     const startOfWeek = new Date(sunday.setHours(0, 0, 0, 0));
//     const endOfWeek = new Date(saturday.setHours(23, 59, 59, 999));

//     console.log("Week range from:", startOfWeek, "to:", endOfWeek);

//     // Fetch traffic logs between Sunday and Saturday
//     const trafficData = await TrafficLog.findAll({
//       where: {
//         is_valid: true,
//         time: {
//           [Op.gte]: startOfWeek,
//           [Op.lte]: endOfWeek,
//         },
//       },
//       attributes: [
//         [sequelize.fn("DAYOFWEEK", sequelize.col("time")), "day"],
//         "action",
//         [sequelize.fn("COUNT", sequelize.col("log_id")), "count"],
//       ],
//       group: ["day", "action"],
//       order: [[sequelize.fn("DAYOFWEEK", sequelize.col("time")), "ASC"]],
//     });

//     // Initialize result array for Sunday to Saturday
//     const result = [
//       { day: "Sun", enter: 0, exit: 0 },
//       { day: "Mon", enter: 0, exit: 0 },
//       { day: "Tue", enter: 0, exit: 0 },
//       { day: "Wed", enter: 0, exit: 0 },
//       { day: "Thu", enter: 0, exit: 0 },
//       { day: "Fri", enter: 0, exit: 0 },
//       { day: "Sat", enter: 0, exit: 0 },
//     ];

//     // Process and group traffic logs by day
//     trafficData.forEach((log) => {
//       const dayIndex = parseInt(log.get("day")) - 1; // DAYOFWEEK returns 1=Sunday, 7=Saturday
//       if (log.get("action") === "enter") {
//         result[dayIndex].enter += log.get("count");
//       } else if (log.get("action") === "exit") {
//         result[dayIndex].exit += log.get("count");
//       }
//     });

//     res.status(200).json({
//       code: 200,
//       message: "Data fetched successfully",
//       info: result,
//     });
//   } catch (error) {
//     console.error("Error fetching traffic log data by week:", error);
//     res
//       .status(500)
//       .json({ code: 500, message: "Server error", error: error.message });
//   }
// };

const TrafficLog = require('../models/trafficLogModel');
const User = require('../models/userModel');
const RfidCard = require('../models/rfidCardModel');
const Device = require('../models/deviceModel');
const {Op} = require('sequelize');
const sequelize = require('../config/database');

// Get all logs
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await TrafficLog.findAll();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve logs'});
    }
};

// exports.getDetailedLogs = async (req, res) => {
//   try {
//     const logs = await TrafficLog.findAll({
//       include: [
//         {
//           model: RfidCard,
//           attributes: ['card_number', 'vehicle_number', 'vehicle_type'], // Fields from RfidCard
//           include: [
//             {
//               model: User,
//               attributes: ['user_id', 'username'] // Fields from User
//             }
//           ]
//         }
//       ],
//       order: [['time', 'DESC']] // Optional: Order by time, descending
//     });
//
//     if (logs.length === 0) {
//       return res.status(404).json({
//         code: 404,
//         message: 'No logs found.' });
//     }
//
//     res.status(200).json({
//       code: 200,
//       message: 'All logs fetched successfully',
//       info: logs
//     });z
//   } catch (error) {
//     console.error('Error fetching detailed logs:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.getDetailedLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, startDate, endDate, all = false } = req.query;

        // Ensure time alignment for date range using JS Date
        const whereCondition = {};
        if (startDate && endDate) {
            whereCondition.time = {
                [Op.between]: [
                    new Date(new Date(startDate).setHours(0, 0, 0, 0)), // Start of startDate
                    new Date(new Date(endDate).setHours(23, 59, 59, 999)), // End of endDate
                ],
            };
        } else if (startDate) {
            whereCondition.time = {
                [Op.gte]: new Date(new Date(startDate).setHours(0, 0, 0, 0)), // Start of startDate
            };
        } else if (endDate) {
            whereCondition.time = {
                [Op.lte]: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // End of endDate
            };
        }

        // Check if `all` is true
        let queryOptions = {
            where: whereCondition,
            include: [
                {
                    model: RfidCard,
                    attributes: ['card_number', 'vehicle_number', 'vehicle_type'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'username'],
                        },
                    ],
                },
                {
                    model: Device, // Include the Device model
                    attributes: ['embed_id'], // Fetch the embed_id
                },
            ],
            order: [['time', 'DESC']],
        };

        if (all === 'true') {
            // Fetch all logs without pagination
            const logs = await TrafficLog.findAll(queryOptions);

            if (logs.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: 'No logs found for the given criteria.',
                });
            }

            return res.status(200).json({
                code: 200,
                message: 'All logs fetched successfully',
                info: {
                    logs,
                },
            });
        } else {
            // Paginated query
            queryOptions.limit = parseInt(limit);
            queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);

            const { count, rows } = await TrafficLog.findAndCountAll(queryOptions);

            if (rows.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: 'No logs found for the given criteria.',
                });
            }

            return res.status(200).json({
                code: 200,
                message: 'Logs fetched successfully',
                info: {
                    logs: rows,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(count / limit),
                        totalRecords: count,
                    },
                }
            });
        }
    } catch (error) {
        console.error('Error fetching detailed logs:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





exports.getTrafficByHour = async (req, res) => {
    try {
        // Fetch all traffic logs
        const logs = await TrafficLog.findAll();

        // Prepare a data structure to hold the counts per 2-hour range
        const trafficData = [];
        const hourRanges = [
            '0:00-2:00', '2:00-4:00', '4:00-6:00', '6:00-8:00',
            '8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00',
            '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-24:00',
        ];

        // Initialize trafficData with counts and days tracked
        hourRanges.forEach(range => {
            trafficData.push({range, enter: 0, exit: 0, days: new Set()});
        });

        // Process logs and group by 2-hour ranges
        logs.forEach(log => {
            const logDate = new Date(log.time).toISOString().split('T')[0];
            const logHour = new Date(log.time).getHours();
            const index = Math.floor(logHour / 2); // Get 2-hour range index

            if (log.action === 'enter') {
                trafficData[index].enter++;
            } else if (log.action === 'exit') {
                trafficData[index].exit++;
            }

            // Track unique days for averaging
            trafficData[index].days.add(logDate);
        });

        // Calculate the average for each time interval
        trafficData.forEach(interval => {
            const dayCount = interval.days.size;
            if (dayCount > 0) {
                interval.enter = Math.round(interval.enter / dayCount);
                interval.exit = Math.round(interval.exit / dayCount);
            }
            delete interval.days; // Remove days set as it's no longer needed
        });

        res.status(200).json(
            {
                code: 200,
                message: 'Data fetched successfully',
                info: trafficData
            });
    } catch (error) {
        res.status(500).json({error: 'Failed to calculate average traffic by hour'});
    }
};


exports.getTrafficByDay = async (req, res) => {
    try {
        let {date} = req.query;

        // If no date is provided, default to the current date
        const currentDate = date ? new Date(date) : new Date();

        // Get the start and end of the specified day
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));  // 00:00:00
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // 23:59:59

        // Query traffic logs for the specific day
        const trafficLogs = await TrafficLog.findAll({
            where: {
                time: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            order: [['time', 'ASC']] // Optional: order by time ascending
        });

        if (trafficLogs.length === 0) {
            return res.status(404).json({message: 'No traffic logs found for the specified day.'});
        }

        // Return the logs for the day
        res.status(200).json(trafficLogs);
    } catch (error) {
        console.error('Error fetching traffic logs for the specific day:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

exports.getTrafficByWeek = async (req, res) => {
    try {
        let {start_date} = req.query;

        // Parse the start_date (Sunday), default to current date if not provided
        const currentDate = start_date ? new Date(start_date) : new Date();
        const dayOfWeek = currentDate.getDay();
        const sunday = new Date(currentDate);
        sunday.setDate(sunday.getDate() - dayOfWeek); // Move back to Sunday
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6); // Move forward to Saturday

        // Set time to 00:00:00 for Sunday start and 23:59:59 for Saturday end
        const startOfWeek = new Date(sunday.setHours(0, 0, 0, 0));
        const endOfWeek = new Date(saturday.setHours(23, 59, 59, 999));

        console.log('Week range from:', startOfWeek, 'to:', endOfWeek);

        // Fetch traffic logs between Sunday and Saturday
        const trafficData = await TrafficLog.findAll({
            where: {
                time: {
                    [Op.gte]: startOfWeek,
                    [Op.lte]: endOfWeek,
                }
            },
            attributes: [
                [sequelize.fn('DAYOFWEEK', sequelize.col('time')), 'day'],
                'action',
                [sequelize.fn('COUNT', sequelize.col('log_id')), 'count']
            ],
            group: ['day', 'action'],
            order: [[sequelize.fn('DAYOFWEEK', sequelize.col('time')), 'ASC']],
        });

        // Initialize result array for Sunday to Saturday
        const result = [
            {day: 'Sun', enter: 0, exit: 0},
            {day: 'Mon', enter: 0, exit: 0},
            {day: 'Tue', enter: 0, exit: 0},
            {day: 'Wed', enter: 0, exit: 0},
            {day: 'Thu', enter: 0, exit: 0},
            {day: 'Fri', enter: 0, exit: 0},
            {day: 'Sat', enter: 0, exit: 0}
        ];

        // Process and group traffic logs by day
        trafficData.forEach(log => {
            const dayIndex = parseInt(log.get('day')) - 1; // DAYOFWEEK returns 1=Sunday, 7=Saturday
            if (log.get('action') === 'enter') {
                result[dayIndex].enter += log.get('count');
            } else if (log.get('action') === 'exit') {
                result[dayIndex].exit += log.get('count');
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Data fetched successfully',
            info: result
        });
    } catch (error) {
        console.error('Error fetching traffic log data by week:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

exports.getLogsByCardId = async (req, res) => {
    const {cardId} = req.params; // Get card_id from URL parameters

    try {
        // Fetch logs for the specified card ID
        const logs = await TrafficLog.findAll({
            where: {
                card_id: cardId // Filter by card ID
            },
            order: [['time', 'DESC']], // Optional: Order by time
        });

        // Check if logs were found
        if (logs.length === 0) {
            return res.status(404).json({message: 'No logs found for this card ID.'});
        }

        res.status(200).json(logs); // Return the logs
    } catch (error) {
        console.error('Error fetching user logs by card ID:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

exports.getUserLogsByUserId = async (req, res) => {
    const { userId } = req.params; // Get user_id from URL parameters

    try {
        // Fetch RFID cards for the specified user ID
        const rfidCards = await RfidCard.findAll({
            where: {
                user_id: userId // Filter by user ID
            }
        });

        if (rfidCards.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'No RFID cards found for this user ID.'
            });
        }

        // Extract card IDs to fetch logs
        const cardIds = rfidCards.map(card => card.card_id);

        // Fetch logs for the specified card IDs with associated RfidCard and User
        const logs = await TrafficLog.findAll({
            where: {
                card_id: cardIds // Filter by card IDs
            },
            include: [
                {
                    model: RfidCard,
                    attributes: ['card_number', 'vehicle_number', 'vehicle_type'], // Fields from RfidCard
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'username'] // Fields from User
                        }
                    ]
                }
            ],
            order: [['time', 'DESC']] // Optional: Order by time, descending
        });

        // Check if logs were found
        if (logs.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'No logs found for this user ID.'
            });
        }

        res.status(200).json({
            code: 200,
            message: 'User logs fetched successfully',
            info: logs // Return the detailed logs
        });
    } catch (error) {
        console.error('Error fetching user logs by user ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
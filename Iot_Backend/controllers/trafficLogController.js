const TrafficLog = require('../models/trafficLogModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await TrafficLog.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
};

// Get traffic count by hour (2-hour periods)
exports.getTrafficByHour = async (req, res) => {
  try {
    const logs = await TrafficLog.findAll();

    // Prepare a data structure to hold the counts per 2-hour range
    const trafficData = [];
    const hourRanges = [
      '0:00-2:00', '2:00-4:00', '4:00-6:00', '6:00-8:00',
      '8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00',
      '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-24:00',
    ];

    // Initialize trafficData with empty values
    hourRanges.forEach(range => {
      trafficData.push({ range, entering: 0, leaving: 0 });
    });

    // Process logs and group by hour ranges
    logs.forEach(log => {
      const logHour = new Date(log.time).getHours();
      const index = Math.floor(logHour / 2); // Get 2-hour range index

      if (log.action === 'enter') {
        trafficData[index].entering++;
      } else if (log.action === 'exit') {
        trafficData[index].leaving++;
      }
    });

    res.status(200).json(trafficData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate traffic by hour' });
  }
};

exports.getTrafficByWeek = async (req, res) => {
  try {
    let { start_date } = req.query;

    const currentDate = start_date ? new Date(start_date) : new Date();

    // Calculate Monday
    const dayOfWeek = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() - ((dayOfWeek + 6) % 7));

    // Calculate Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    console.log('Monday:', monday, 'Sunday:', sunday); // Log the calculated dates

    // Query logs
    const trafficData = await TrafficLog.findAll({
      where: {
        time: {
          [Op.between]: [monday, sunday],
        }
      },
      attributes: [
        [sequelize.fn('DAYOFWEEK', sequelize.col('time')), 'day'],
        'action',
        [sequelize.fn('COUNT', sequelize.col('log_id')), 'count']
      ],
      group: ['day', 'action']
    });

    console.log('Traffic Data:', trafficData); // Log the fetched traffic data

    // Initialize result array
    const result = [
      { day: '1', entering: 0, leaving: 0 }, // Sunday
      { day: '2', entering: 0, leaving: 0 }, // Monday
      { day: '3', entering: 0, leaving: 0 }, // Tuesday
      { day: '4', entering: 0, leaving: 0 }, // Wednesday
      { day: '5', entering: 0, leaving: 0 }, // Thursday
      { day: '6', entering: 0, leaving: 0 }, // Friday
      { day: '7', entering: 0, leaving: 0 }  // Saturday
    ];

    trafficData.forEach(log => {
      const dayIndex = parseInt(log.get('day')) - 1; // Correctly map DAYOFWEEK to array index (Sunday = 0)
      if (log.get('action') === 'enter') {
        result[dayIndex].entering += log.get('count'); // Use += to accumulate counts
      } else if (log.get('action') === 'exit') {
        result[dayIndex].leaving += log.get('count'); // Use += to accumulate counts
      }
    });

    res.json(result);
    
  } catch (error) {
    console.error('Error fetching traffic log data by day of the week:', error);
    res.status(500).json({ message: 'Server error', error: error.message }); // Include error details in response
  }
};

exports.getLogsByCardId = async (req, res) => {
  const { cardId } = req.params; // Get card_id from URL parameters

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
      return res.status(404).json({ message: 'No logs found for this card ID.' });
    }

    res.status(200).json(logs); // Return the logs
  } catch (error) {
    console.error('Error fetching user logs by card ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
      return res.status(404).json({ message: 'No RFID cards found for this user ID.' });
    }

    // Extract card IDs to fetch logs
    const cardIds = rfidCards.map(card => card.card_id);

    // Fetch logs for the specified card IDs
    const logs = await TrafficLog.findAll({
      where: {
        card_id: cardIds // Filter by card IDs
      },
      order: [['time', 'DESC']], // Optional: Order by time
    });

    // Check if logs were found
    if (logs.length === 0) {
      return res.status(404).json({ message: 'No logs found for this user ID.' });
    }

    res.status(200).json(logs); // Return the logs
  } catch (error) {
    console.error('Error fetching user logs by user ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
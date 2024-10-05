const Log = require('../models/logModel');

// Unlock the lock and store the log in MySQL
const unlockLock = async (req, res) => {
  try {
    // Here you'd trigger the actual hardware (ESP32)
    lockStatus = 'unlocked';

    // Log the unlock event in MySQL
    await Log.create({
      user: req.body.user || 'Unknown',
      action: 'unlocked',
    });

    res.status(200).json({ message: 'Lock unlocked', status: lockStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error unlocking lock', error: error.message });
  }
};

// Get access logs from MySQL
const getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll();  // Fetch all logs from MySQL
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving logs', error: error.message });
  }
};

module.exports = { getLockStatus, unlockLock, getLogs };

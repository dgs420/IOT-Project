const express = require('express');
const router = express.Router();
const TrafficLogController = require('../controllers/trafficLogController');

router.get('/all-logs', TrafficLogController.getAllLogs);
router.get('/logs-by-hour', TrafficLogController.getTrafficByHour);
router.get('/traffic-by-week', TrafficLogController.getTrafficByWeek);

module.exports = router;
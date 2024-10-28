const express = require('express');
const router = express.Router();
const TrafficLogController = require('../controllers/trafficLogController');

router.get('/all-logs', TrafficLogController.getAllLogs);
router.get('/all-logs-details', TrafficLogController.getDetailedLogs);
router.get('/logs-by-hour', TrafficLogController.getTrafficByHour);
router.get('/traffic-by-week', TrafficLogController.getTrafficByWeek);
router.get('/traffic-by-day', TrafficLogController.getTrafficByDay);
router.get('/logs-by-user/:userId', TrafficLogController.getUserLogsByUserId);


module.exports = router;
const express = require('express');
const router = express.Router();
const TrafficLogController = require('../controllers/trafficLogController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole")
router.use(requireAuth);

router.get('/all-logs',requireRole(['manager','admin']), TrafficLogController.getLogs);
router.get('/all-logs-details',requireRole(['manager','admin']), TrafficLogController.getDetailedLogs);
router.get('/logs-by-hour',requireRole(['manager','admin']), TrafficLogController.getTrafficByHour);
router.get('/traffic-by-week',requireRole(['manager','admin']), TrafficLogController.getTrafficByWeek);
router.get('/traffic-by-day',requireRole(['manager','admin']), TrafficLogController.getTrafficByDay);
// router.get('/logs-by-user/:userId',requireRole(['manager','admin']), TrafficLogController.getUserLogsByUserId);
// router.get('/logs-by-card/:cardId',requireRole(['manager','admin']), TrafficLogController.getLogsByCardId);


module.exports = router;
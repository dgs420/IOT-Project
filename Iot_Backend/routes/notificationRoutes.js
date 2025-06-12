const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('', notificationController.getNotification);
router.put('/read/:notification_id', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

module.exports = router;

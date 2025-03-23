const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get('/all-sessions', SessionController.getAllSessions);

module.exports = router;
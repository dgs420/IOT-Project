const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/',requireRole(['manager','admin']), SessionController.getAllSessions);
router.get('/your-sessions', SessionController.getYourSessions);


module.exports = router;
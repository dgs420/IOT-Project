const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/',requireRole(['manager','admin']), SessionController.getAllSessions);
router.get('/all-sessions',requireRole(['manager','admin']), SessionController.getPaginatedSessions);
router.get('/your-sessions', SessionController.getYourSessions);
router.get('/your-sessions-paginated', SessionController.getPaginatedYourSessions);
router.get('/user-sessions/:userId',requireRole(['manager','admin']), SessionController.getUserSessions);
router.get('/user-sessions-paginated/:userId',requireRole(['manager','admin']), SessionController.getPaginatedUserSessions);



module.exports = router;
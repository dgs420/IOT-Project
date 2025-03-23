const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/requestController');
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get('/all-requests', RequestController.getAllRequests);
router.post('/create-request', RequestController.createRequest);

module.exports = router;
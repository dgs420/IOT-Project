const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/requestController');
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get('/all-requests', RequestController.getAllRequests);
router.get('/your-requests', RequestController.getYourRequests);
router.post('/create-request', RequestController.createRequest);
router.post('/:requestId/approve', RequestController.approveRequest);
router.post('/:requestId/reject', RequestController.rejectRequest);

module.exports = router;
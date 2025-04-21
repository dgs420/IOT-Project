const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.post('/create',requireRole(['manager','admin']), SpaceController.createParkingSpace);
router.put('/update',requireRole(['manager','admin']), SpaceController.updateParkingSpace);
router.get('/', SpaceController.getParkingSpaces);
router.get('/update',requireRole(['manager','admin']), SpaceController.updateTotalSpaces);



module.exports = router;
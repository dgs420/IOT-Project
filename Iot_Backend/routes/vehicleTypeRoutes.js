const express = require('express');
const router = express.Router();
const vehicleTypeController = require('../controllers/vehicleTypeController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/', vehicleTypeController.getAllVehicleType);
router.post('/create-vehicle-type',requireRole('admin'), vehicleTypeController.createVehicleType);
// router.get('/your-vehicles', vehicleController.getYourVehicles);
// router.post('/create-card', rfidCardController.createRfidCard);
// router.delete('/:cardId', rfidCardController.deleteCard);


module.exports = router;
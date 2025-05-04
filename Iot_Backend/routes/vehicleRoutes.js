const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/',requireRole('admin'), vehicleController.getAllVehicles);
router.get('/user-vehicles/:userId',requireRole(['manager','admin']), vehicleController.getVehiclesByUserId);
router.delete('/:cardId',requireRole('admin'), vehicleController.deleteVehicle);
router.get('/your-vehicles', vehicleController.getYourVehicles);
router.get('/recent-vehicles', vehicleController.getYourRecentVehicles);

// router.get('/recent-cards', rfidCardController.getYourRecentRfidCards);
// router.post('/create-card', rfidCardController.createRfidCard);


module.exports = router;
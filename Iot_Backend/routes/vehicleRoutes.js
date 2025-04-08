const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/user-vehicles/:userId',requireRole(['manager','admin']), vehicleController.getVehiclesByUserId);
router.get('/your-vehicles', vehicleController.getYourVehicles);
// router.get('/recent-cards', rfidCardController.getYourRecentRfidCards);
// router.post('/create-card', rfidCardController.createRfidCard);
// router.delete('/:cardId', rfidCardController.deleteCard);


module.exports = router;
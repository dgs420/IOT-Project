const express = require('express');
const router = express.Router();
const vehicleTypeController = require('../controllers/vehicleTypeController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/', vehicleTypeController.getAllVehicleType);
router.post('/create',requireRole('admin'), vehicleTypeController.createVehicleType);
router.put('/update', vehicleTypeController.updateVehicleType);
router.delete('/delete/:typeId', vehicleTypeController.deleteVehicleType);


module.exports = router;
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');


router.get('/', homeController.getHomeCount);
router.get('/vehicles-type-count',homeController.getVehicleCountsByType);


module.exports = router;
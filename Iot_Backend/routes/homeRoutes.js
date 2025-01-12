const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);

router.get('/', homeController.getHomeCount);
router.get('/vehicles-type-count',homeController.getVehicleCountsByType);


module.exports = router;
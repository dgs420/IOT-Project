const express = require('express');
const router = express.Router();
const rfidCardController = require('../controllers/rfidCardController');


router.get('/user-card/:userId', rfidCardController.getRfidCardsByUserId);
router.post('/create-card', rfidCardController.createRfidCard);


module.exports = router;
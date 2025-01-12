const express = require('express');
const router = express.Router();
const rfidCardController = require('../controllers/rfidCardController');
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);
router.get('/user-card/:userId', rfidCardController.getRfidCardsByUserId);
router.post('/create-card', rfidCardController.createRfidCard);
router.delete('/:cardId', rfidCardController.deleteCard);


module.exports = router;
const express = require('express');
const router = express.Router();
const rfidCardController = require('../controllers/rfidCardController');
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);
router.get('/user-card/:userId',requireRole(['manager','admin']), rfidCardController.getRfidCardsByUserId);
router.get('/your-cards', rfidCardController.getYourRfidCards);
router.get('/recent-cards', rfidCardController.getYourRecentRfidCards);
router.post('/create-card',requireRole(['manager','admin']), rfidCardController.createRfidCard);
router.delete('/:cardId', rfidCardController.deleteCard);


module.exports = router;
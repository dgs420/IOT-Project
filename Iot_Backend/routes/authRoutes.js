const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

router.post('/login',authController.login);
router.post('/create-user',requireAuth,requireRole(['manager','admin']),authController.createUser);
router.post('/signup', authController.signup);
module.exports = router;
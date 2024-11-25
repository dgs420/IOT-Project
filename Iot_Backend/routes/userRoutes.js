const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/login',userController.login);
router.post('/signup', userController.signup);
router.get('/all-user', userController.getAllUsers);
router.get('/user-detail/:userId',userController.getUserDetail)
module.exports = router;
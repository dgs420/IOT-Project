const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require('../middleware/requireAuth');


router.get('/all-user', userController.getAllUsers);
router.get('/user-detail/:userId',userController.getUserDetail)
router.delete('/:userId',userController.deleteUser);
module.exports = router;
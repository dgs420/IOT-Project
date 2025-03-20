const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require('../middleware/requireAuth');
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);

router.get('/all-user', userController.getAllUsers);
router.get('/user-detail/:userId',userController.getUserDetail)
router.get('/personal-detail',userController.getUserDetail)
router.put('/user-update/:userId',userController.updateUser)
router.delete('/:userId',userController.deleteUser);
module.exports = router;
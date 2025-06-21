const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require('../middleware/requireAuth');
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);

router.get('/all-user',requireRole(['manager','admin']), userController.getAllUsers);
router.get('/user-detail/:userId',requireRole(['manager','admin']),userController.getUserDetail)
router.put('/user-update/:userId',requireRole(['manager','admin']),userController.updateUser)
router.delete('/:userId',requireRole(['manager','admin']),userController.deleteUser);
router.get('/profile',userController.getPersonalDetail)
router.put('/update', userController.updateProfile);
router.get('/balance', userController.getUserBalance);
module.exports = router;
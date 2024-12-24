const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);
router.get('/', deviceController.getAllDevice);
router.post('/create-device',deviceController.createDevice );
router.get('/:deviceId', deviceController.getDeviceById);
router.put('/:deviceId', deviceController.updateDevice);
router.delete('/:deviceId', deviceController.deleteDevice);


module.exports = router;
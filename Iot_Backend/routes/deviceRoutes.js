const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');


router.use(requireAuth,requireRole(['manager','admin']));

router.get('/', deviceController.getAllDevice);
router.post('/create-device',deviceController.createDevice );
router.get('/:deviceId', deviceController.getDeviceById);
router.put('/:deviceId', deviceController.updateDevice);
router.delete('/:deviceId', deviceController.deleteDevice);
router.post('/command', deviceController.commandDevice);


module.exports = router;
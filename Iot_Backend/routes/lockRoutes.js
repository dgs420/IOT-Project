const express = require('express');
const router = express.Router();
const { getLockStatus, unlockLock, getLogs } = require('../controllers/lockController');

// Lock status route
router.get('/status', getLockStatus);

// Unlock route
router.post('/unlock', unlockLock);

// Access logs route
router.get('/logs', getLogs);

module.exports = router;

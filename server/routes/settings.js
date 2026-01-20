const express = require('express');
const router = express.Router();
const controller = require('../controllers/settingsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', controller.getSettings);
router.post('/', authenticateToken, controller.updateSettings);

module.exports = router;

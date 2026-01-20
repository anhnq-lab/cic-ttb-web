const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/stats', controller.getStats);
router.get('/insight', controller.getInsight);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricingController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { pricingSchema } = require('../schemas/pricing');

router.get('/', controller.getAllPricing);
router.put('/:id', authenticateToken, validate(pricingSchema), controller.updatePricing);

module.exports = router;

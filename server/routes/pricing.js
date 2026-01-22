import express from 'express';
const router = express.Router();
import * as controller from '../controllers/pricingController.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { pricingSchema } from '../schemas/pricing.js';

router.get('/', controller.getAllPricing);
router.put('/:id', authenticateToken, validate(pricingSchema), controller.updatePricing);

export default router;

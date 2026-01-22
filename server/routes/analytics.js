import express from 'express';
const router = express.Router();
import * as controller from '../controllers/analyticsController.js';

router.get('/stats', controller.getStats);
router.get('/insight', controller.getInsight);

export default router;

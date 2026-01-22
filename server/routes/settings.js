import express from 'express';
const router = express.Router();
import * as controller from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';

router.get('/', controller.getSettings);
router.post('/', authenticateToken, controller.updateSettings);

export default router;

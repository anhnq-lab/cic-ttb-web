import express from 'express';
const router = express.Router();
import * as controller from '../controllers/toolController.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { toolSchema } from '../schemas/tools.js';

router.get('/', controller.getAllTools);
router.post('/', authenticateToken, validate(toolSchema), controller.createTool);
router.put('/:id', authenticateToken, validate(toolSchema), controller.updateTool);
router.delete('/:id', authenticateToken, controller.deleteTool);

export default router;

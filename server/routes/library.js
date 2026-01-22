import express from 'express';
const router = express.Router();
import * as controller from '../controllers/libraryController.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { librarySchema } from '../schemas/library.js';

router.get('/', controller.getAllLibrary);
router.post('/', authenticateToken, validate(librarySchema), controller.createLibrary);
router.put('/:id', authenticateToken, validate(librarySchema), controller.updateLibrary);
router.delete('/:id', authenticateToken, controller.deleteLibrary);

export default router;

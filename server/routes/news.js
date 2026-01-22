import express from 'express';
const router = express.Router();
import * as controller from '../controllers/newsController.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { newsSchema } from '../schemas/news.js';

router.get('/', controller.getAllNews);
router.get('/:id', controller.getNewsById);
router.get('/:id/related', controller.getRelatedNews);
router.post('/', authenticateToken, validate(newsSchema), controller.createNews);
router.put('/:id', authenticateToken, validate(newsSchema), controller.updateNews);
router.delete('/:id', authenticateToken, controller.deleteNews);

export default router;

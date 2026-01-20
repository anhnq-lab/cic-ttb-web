const express = require('express');
const router = express.Router();
const controller = require('../controllers/newsController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { newsSchema } = require('../schemas/news');

router.get('/', controller.getAllNews);
router.get('/:id', controller.getNewsById);
router.get('/:id/related', controller.getRelatedNews);
router.post('/', authenticateToken, validate(newsSchema), controller.createNews);
router.put('/:id', authenticateToken, validate(newsSchema), controller.updateNews);
router.delete('/:id', authenticateToken, controller.deleteNews);

module.exports = router;

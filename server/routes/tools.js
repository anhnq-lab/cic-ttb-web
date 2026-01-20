const express = require('express');
const router = express.Router();
const controller = require('../controllers/toolController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { toolSchema } = require('../schemas/tools');

router.get('/', controller.getAllTools);
router.post('/', authenticateToken, validate(toolSchema), controller.createTool);
router.put('/:id', authenticateToken, validate(toolSchema), controller.updateTool);
router.delete('/:id', authenticateToken, controller.deleteTool);

module.exports = router;

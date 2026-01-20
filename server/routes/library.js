const express = require('express');
const router = express.Router();
const controller = require('../controllers/libraryController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { librarySchema } = require('../schemas/library');

router.get('/', controller.getAllLibrary);
router.post('/', authenticateToken, validate(librarySchema), controller.createLibrary);
router.put('/:id', authenticateToken, validate(librarySchema), controller.updateLibrary);
router.delete('/:id', authenticateToken, controller.deleteLibrary);

module.exports = router;

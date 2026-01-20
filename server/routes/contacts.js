const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { contactSchema } = require('../schemas/contact');

router.get('/', controller.getAllContacts);
router.post('/', validate(contactSchema), controller.createContact); // Public access for creating contact
router.delete('/:id', authenticateToken, controller.deleteContact);

module.exports = router;

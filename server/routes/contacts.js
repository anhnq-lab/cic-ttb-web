import express from 'express';
const router = express.Router();
import * as controller from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { contactSchema } from '../schemas/contact.js';

router.get('/', controller.getAllContacts);
router.post('/', validate(contactSchema), controller.createContact); // Public access for creating contact
router.delete('/:id', authenticateToken, controller.deleteContact);

export default router;

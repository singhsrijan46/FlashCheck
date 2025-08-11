import express from 'express';
import { 
    submitContactForm, 
    getAllContacts, 
    getContactById, 
    updateContactStatus, 
    deleteContact, 
    getContactStats 
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/auth.js';

const contactRouter = express.Router();

// Public routes
contactRouter.post('/submit', submitContactForm);

// Admin routes (protected)
contactRouter.get('/admin/all', protectAdmin, getAllContacts);
contactRouter.get('/admin/stats', protectAdmin, getContactStats);
contactRouter.get('/admin/:id', protectAdmin, getContactById);
contactRouter.put('/admin/:id/status', protectAdmin, updateContactStatus);
contactRouter.delete('/admin/:id', protectAdmin, deleteContact);

export default contactRouter;

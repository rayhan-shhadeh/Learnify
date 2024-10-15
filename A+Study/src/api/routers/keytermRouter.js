
import express from 'express';
import { keytermController } from '../controllers/keytermController.js';
export const keytermRouter = express.Router();

// Define routes
keytermRouter.post('/keyterms', keytermController.createKeyterm);
keytermRouter.put('/keyterms/:id', keytermController.updateKeyterm);
keytermRouter.delete('/keyterms/:id', keytermController.deleteKeyterm);
keytermRouter.get('/keyterms/:id', keytermController.getKeytermById);

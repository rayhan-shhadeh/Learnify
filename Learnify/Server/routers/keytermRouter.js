
import express from 'express';
import { keytermController } from '../controllers/keytermController.js';
export const keytermRouter = express.Router();
import { authController, restrictTo } from '../controllers/authController.js';

// Define routes
keytermRouter.post('/keyterm', keytermController.createKeyterm);
keytermRouter.put('/keyterm/:id', keytermController.updateKeyterm);
keytermRouter.delete('/keyterm/:id', keytermController.deleteKeyterm);
keytermRouter.get('/keyterm/:id',authController.protect, restrictTo( 2,3), keytermController.getKeytermById );
keytermRouter.get('/keyterms/:termOrDef', keytermController.getKeytermByTermOrDef);
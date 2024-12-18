import express from 'express';
import { keytermController } from '../controllers/keytermController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const keytermRouter = express.Router();

// Define routes
keytermRouter.post('/keyterm', keytermController.createKeyterm);
keytermRouter.put('/keyterm/:id', keytermController.updateKeyterm);
keytermRouter.delete('/keyterm/:id', keytermController.deleteKeyterm);
keytermRouter.get('/keyterm/:id',authController.protect, restrictTo( 1,2,3), keytermController.getKeytermById );
keytermRouter.get('/keyterms/:termOrDef', keytermController.getKeytermByTermOrDef);
keytermRouter.post('/keyterm', authController.protect, restrictTo( 1,2), keytermController.createKeyterm);
keytermRouter.put('/keyterm/:id', authController.protect, restrictTo( 1,2),keytermController.updateKeyterm);
keytermRouter.delete('/keyterm/:id', authController.protect, restrictTo(1, 2), keytermController.deleteKeyterm);
keytermRouter.get('/keyterm/:id', authController.protect, restrictTo( 1,2),keytermController.getKeytermById);
keytermRouter.get('/keyterms/:termOrDef', authController.protect, restrictTo( 1,2),keytermController.getKeytermByTermOrDef);
keytermRouter.post('/smartKeyterms/:fileid',authController.protect, restrictTo( 1,2), keytermController.generateSmartKeyterms);

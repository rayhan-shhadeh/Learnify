import express from 'express';
import { keytermController } from '../controllers/keytermController.js';
export const keytermRouter = express.Router();

keytermRouter.post('/keyterm', keytermController.createKeyterm);
keytermRouter.put('/keyterm/:id',keytermController.updateKeyterm);
keytermRouter.delete('/keyterm/:id',keytermController.deleteKeyterm);
keytermRouter.get('/keyterm/:id',keytermController.getKeytermById);
keytermRouter.get('/keyterms/:termOrDef',keytermController.getKeytermByTermOrDef);
keytermRouter.post('/smartKeyterms/:fileid',keytermController.generateSmartKeyterms);

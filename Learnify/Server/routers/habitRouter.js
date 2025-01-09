import express from 'express';
import { habitController } from '../controllers/habitController.js';
export const habitRouter = express.Router();

habitRouter.post('/habit',habitController.createHabit);
habitRouter.put('/habit/:id',habitController.updateHabit);
habitRouter.delete('/habit/:id',habitController.deleteHabit);
habitRouter.get('/habit/:id', habitController.getHabitById);
habitRouter.get('/habit/all/:userId',habitController.getHabitsByUserId);


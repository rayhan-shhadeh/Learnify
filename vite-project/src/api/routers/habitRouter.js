import express from 'express';
import { habitController } from '../controllers/habitController.js';
export const habitRouter = express.Router();

// Define routes
habitRouter.post('/habits', habitController.createHabit);
habitRouter.put('/habits/:id', habitController.updateHabit);
habitRouter.delete('/habits/:id', habitController.deleteHabit);
habitRouter.get('/habits/:id', habitController.getHabitById);

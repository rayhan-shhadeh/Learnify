import express from 'express';
import { habitController } from '../controllers/habitController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const habitRouter = express.Router();

habitRouter.post('/habit',authController.protect, restrictTo( 1,2), habitController.createHabit);
habitRouter.put('/habit/:id',authController.protect, restrictTo( 1,2), habitController.updateHabit);
habitRouter.delete('/habit/:id', authController.protect, restrictTo( 1,2),habitController.deleteHabit);
habitRouter.get('/habit/:id',authController.protect, restrictTo( 1,2), habitController.getHabitById);
habitRouter.get('/habit/all/:userId',authController.protect, restrictTo( 1,2), habitController.getHabitsByUserId);


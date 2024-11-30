import express from 'express';
import {trackHabitController} from '../controllers/trackhabitController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const trackHabitRouter = express.Router();

trackHabitRouter.post('/trackHabit/isComplete/:habitId',authController.protect, restrictTo( 1,2),  trackHabitController.markHabitAsComplete);
trackHabitRouter.get('/trackHabit/weeklyTracker/:habitId',authController.protect, restrictTo( 1,2), trackHabitController.weeklyTracker);
trackHabitRouter.get('/trackHabit/monthlyTracker/:habitId',authController.protect, restrictTo( 1,2), trackHabitController.monthlyTracker);
trackHabitRouter.get('/trackHabit/allHabit/:userId',authController.protect, restrictTo( 1,2), trackHabitController.allHabitsTracker);

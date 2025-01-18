import express from 'express';
import {trackHabitController} from '../controllers/trackhabitController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const trackHabitRouter = express.Router();

trackHabitRouter.post('/trackHabit/isComplete/:habitId', trackHabitController.markHabitAsComplete);
trackHabitRouter.get('/trackHabit/weeklyTracker/:habitId', trackHabitController.weeklyTracker);
trackHabitRouter.get('/trackHabit/monthlyTracker/:habitId/', trackHabitController.monthlyTracker);
trackHabitRouter.post('/trackHabit/allHabit/:userId', trackHabitController.allHabitsTracker);

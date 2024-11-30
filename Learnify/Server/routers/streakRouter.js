import express from 'express';
import { streakController } from '../controllers/streakController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const streakRouter = express.Router();

streakRouter.get('/streak/currentStreak/:habitId',authController.protect, restrictTo( 1,2), streakController.getStreakByUserIdAndHabitId);
streakRouter.patch('/streak/restartStreak/:habitId',authController.protect, restrictTo( 1,2), streakController.restartStreak);



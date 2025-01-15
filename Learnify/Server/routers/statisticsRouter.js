import express from 'express';
import { statisticsController } from '../controllers/statisticsController.js';
export const statisticsRouter = express.Router();

statisticsRouter.get('/profile/statistics/:userId',statisticsController.userStatistics);

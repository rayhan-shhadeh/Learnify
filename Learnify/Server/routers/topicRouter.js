import express from 'express';
import { topicController } from '../controllers/topicController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const topicRouter = express.Router();

topicRouter.post('/topic', authController.protect, restrictTo( 1,2), topicController.createTopic);
topicRouter.get('/topic/:topicName',authController.protect, restrictTo( 1,2),  topicController.getTopicByName);

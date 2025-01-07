import express from 'express';
import { topicController } from '../controllers/topicController.js';
export const topicRouter = express.Router();

topicRouter.post('/topic',topicController.createTopic);
topicRouter.get('/topic/:topicName',topicController.getTopicByNameAndLevel);
topicRouter.delete('/topic/:topicId',topicController.deleteTopic);

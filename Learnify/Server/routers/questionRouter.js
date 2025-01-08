import express from 'express';
import { questionController } from '../controllers/questionController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const questionRouter = express.Router();

questionRouter.post('/question', questionController.createQuestion);
questionRouter.delete('/question/:id',  questionController.deleteQuestion);
questionRouter.get('/question/:id', questionController.getQuestionById);
questionRouter.get('/quiz/questions/:id',  questionController.getQuestionsByQuizId);


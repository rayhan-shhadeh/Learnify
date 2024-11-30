import express from 'express';
import { questionController } from '../controllers/questionController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const questionRouter = express.Router();

questionRouter.post('/question',authController.protect, restrictTo( 1,2), questionController.createQuestion);
questionRouter.delete('/question/:id',authController.protect, restrictTo( 1,2),  questionController.deleteQuestion);
questionRouter.get('/question/:id', authController.protect, restrictTo( 1,2), questionController.getQuestionById);
questionRouter.get('/quiz/questions/:id',authController.protect, restrictTo( 1,2),  questionController.getQuestionsByQuizId);


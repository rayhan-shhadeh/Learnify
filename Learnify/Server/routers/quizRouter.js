import express from 'express';
import { quizController } from '../controllers/quizController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const quizRouter = express.Router();

quizRouter.delete('/quiz/:id',quizController.deleteQuiz);
quizRouter.post('/file/generateQuiz/:fileid',quizController.generateQuiz);
quizRouter.get('/quiz/:id',quizController.getQuizById);
quizRouter.get('/maxQuizId',quizController.getMaxQuizId);
quizRouter.get('/quiz/history/:userId',quizController.getQuizHistory);
quizRouter.patch('/quiz/:quizId',quizController.updateQuizScore);


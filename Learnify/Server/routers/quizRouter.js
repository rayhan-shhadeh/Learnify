import express from 'express';
import { quizController } from '../controllers/quizController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const quizRouter = express.Router();

quizRouter.delete('/quiz/:id', authController.protect, restrictTo( 1,2), quizController.deleteQuiz);
quizRouter.post('/file/generateQuiz/:fileid',authController.protect, restrictTo( 1,2),  quizController.generateQuiz);
quizRouter.get('/quiz/:id', authController.protect, restrictTo( 1,2), quizController.getQuizById);

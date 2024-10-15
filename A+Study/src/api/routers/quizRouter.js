import express from 'express';
import { quizController } from '../controllers/quizController.js';
export const quizRouter = express.Router();

// Define routes
quizRouter.post('/quizzes', quizController.createQuiz);
quizRouter.delete('/quizzes/:id', quizController.deleteQuiz);

import express from 'express';
import { quizController } from '../controllers/quizController.js';
export const quizRouter = express.Router();

// Define routes
quizRouter.post('/quiz', quizController.createQuiz);
quizRouter.delete('/quiz/:id', quizController.deleteQuiz);

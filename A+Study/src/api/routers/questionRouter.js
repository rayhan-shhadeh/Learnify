import express from 'express';
import { questionController } from '../controllers/questionController.js';
export const questionRouter = express.Router();

// Define routes
questionRouter.post('/questions', questionController.createQuestion);
questionRouter.delete('/questions/:id', questionController.deleteQuestion);

import express from 'express';
import { questionController } from '../controllers/questionController.js';
export const questionRouter = express.Router();

// Define routes
questionRouter.post('/question', questionController.createQuestion);
questionRouter.delete('/question/:id', questionController.deleteQuestion);

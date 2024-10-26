import express from 'express';
import { answerController } from '../controllers/answerController.js';
export const answerRouter = express.Router();

// Define routes
answerRouter.post('/answer', answerController.createAnswer);
answerRouter.put('/answer/:id', answerController.updateAnswer);
answerRouter.delete('/answer/:id', answerController.deleteAnswer);
answerRouter.get('/answer/:id', answerController.getAnswerById);



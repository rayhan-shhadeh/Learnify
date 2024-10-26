import express from 'express';
import { answerController } from '../controllers/answerController.js';
export const answerRouter = express.Router();

// Define routes
answerRouter.post('/answers', answerController.createAnswer);
answerRouter.put('/answers/:id', answerController.updateAnswer);
answerRouter.delete('/answers/:id', answerController.deleteAnswer);
answerRouter.get('/answers/:id', answerController.getAnswerById);



import express from 'express';
import { answerController } from '../controllers/answerController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const answerRouter = express.Router();

answerRouter.post('/answer',authController.protect, restrictTo( 1,2), answerController.createAnswer);
answerRouter.put('/answer/:id',authController.protect, restrictTo( 1,2), answerController.updateAnswer);
answerRouter.delete('/answer/:id',authController.protect, restrictTo( 1,2), answerController.deleteAnswer);
answerRouter.get('/answer/:id',authController.protect, restrictTo( 1,2), answerController.getAnswerById);
answerRouter.get('/quiz/question/answer/:id',authController.protect, restrictTo( 1,2), answerController.getAnswerByQuestionId);



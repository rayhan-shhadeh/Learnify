import express from 'express';
export const practiceRouter = express.Router();
import { practiceController } from '../controllers/practiceController.js';

practiceRouter.post('/file/practice/review/:flashcardId',practiceController.updateReview);
practiceRouter.post('/file/practice/:fileId',practiceController.fetchFlashcardsForPractice);

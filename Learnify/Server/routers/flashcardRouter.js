import express from 'express';
import { flashcardController } from '../controllers/flashcardController.js';
export const flashcardRouter = express.Router();
import { authController } from '../controllers/authController.js';

// Define routes
flashcardRouter.post('/flashcard', flashcardController.createFlashcard);
flashcardRouter.put('/flashcard/:id', flashcardController.updateFlashcard);
flashcardRouter.delete('/flashcard/:id', flashcardController.deleteFlashcard);
flashcardRouter.get('/flashcard/:id', flashcardController.getFlashcardById);
flashcardRouter.get('/flashcards/:QorA', flashcardController.getFlashcardByQorA);


import express from 'express';
import { flashcardController } from '../controllers/flashcardController.js';
export const flashcardRouter = express.Router();

// Define routes
flashcardRouter.post('/flashcards', flashcardController.createFlashcard);
flashcardRouter.put('/flashcards/:id', flashcardController.updateFlashcard);
flashcardRouter.delete('/flashcards/:id', flashcardController.deleteFlashcard);
flashcardRouter.get('/flashcards/:id', flashcardController.getFlashcardById);

import express from 'express';
import { flashcardController } from '../controllers/flashcardController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const flashcardRouter = express.Router();

flashcardRouter.post('/flashcard',/* authController.protect, restrictTo( 1,2),*/flashcardController.createFlashcard);
flashcardRouter.put('/flashcard/:id', /*authController.protect, restrictTo( 1,2),*/flashcardController.updateFlashcard);
flashcardRouter.delete('/flashcard/:id',/*authController.protect, restrictTo( 1,2),*/ flashcardController.deleteFlashcard);
flashcardRouter.get('/flashcard/:id',/*authController.protect, restrictTo( 1,2),*/ flashcardController.getFlashcardById);
flashcardRouter.get('/flashcards/:QorA',/*authController.protect, restrictTo( 1,2),*/ flashcardController.getFlashcardByQorA);
flashcardRouter.post('/smartFlashcards/:fileid',/*authController.protect, restrictTo( 1,2),*/ flashcardController.generateSmartFlashcard);



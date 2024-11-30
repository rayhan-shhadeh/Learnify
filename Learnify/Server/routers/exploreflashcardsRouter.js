import express from 'express';
import { exploreflashcardsController } from '../controllers/exploreflashcardsController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const exploreflashcardsRouter = express.Router();

exploreflashcardsRouter.get('/expoloreflashcards/:topicId', authController.protect, restrictTo( 1,2),exploreflashcardsController.getExploreFlashcardsByTopicId);

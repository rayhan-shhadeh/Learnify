import express from 'express';
import { exploreflashcardsController } from '../controllers/exploreflashcardsController.js';
export const exploreflashcardsRouter = express.Router();

exploreflashcardsRouter.get('/expoloreflashcards/:topicId', exploreflashcardsController.getExploreFlashcardsByTopicId);

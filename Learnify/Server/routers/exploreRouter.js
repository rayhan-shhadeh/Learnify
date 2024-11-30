import express from 'express';
import {exploreController} from '../controllers/exploreController.js'
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const exploreRouter = express.Router();

exploreRouter.get('/exploreflashcards/searchTopic/:topicName',authController.protect, restrictTo( 1,2), exploreController.searchTopic);
exploreRouter.get('/exploreflashcards/suggestedTopics/:majorName',authController.protect, restrictTo( 1,2), exploreController.suggestedTopics);
exploreRouter.get('/exploreflashcards/exploreMore/:topicName',authController.protect, restrictTo( 1,2), exploreController.exploreMore);



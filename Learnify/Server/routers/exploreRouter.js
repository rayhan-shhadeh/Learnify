import express from 'express';
import {exploreController} from '../controllers/exploreController.js'
export const exploreRouter = express.Router();

exploreRouter.post('/exploreflashcards/searchTopic/:topicName', exploreController.searchTopic);
exploreRouter.get('/exploreflashcards/suggestedTopics/:majorName', exploreController.suggestedTopics);
exploreRouter.get('/exploreflashcards/exploreMore/:topicName', exploreController.exploreMore);
exploreRouter.get('/exploreflashcards/relatedTopics/:userId', exploreController.relatedTopics);
exploreRouter.get('/exploreflashcards/popularTopics', exploreController.popularTopics);



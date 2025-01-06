import express from 'express';
import { exploreHistoryController} from '../controllers/explorehistoryController.js';
export const exploreHistoryRouter = express.Router();

exploreHistoryRouter.get('/exploreflashcards/exploreHistory/:userId', exploreHistoryController.getExploreHistory);

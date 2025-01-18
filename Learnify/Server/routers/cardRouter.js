import express from 'express';
import { cardController } from '../controllers/cardController.js';

export const cardRouter = express.Router();

cardRouter.get('/user/cards/:userId', cardController.getCardsByUserID);
cardRouter.delete('/card/:cardId', cardController.deleteCard);
cardRouter.get('/card/:cardId', cardController.getCardById);

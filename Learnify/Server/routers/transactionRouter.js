import express from 'express';
import { transactionController } from '../controllers/transactionController.js';

export const transactionRouter = express.Router();

transactionRouter.get('/user/transactions/:userId', transactionController.getTransactionsByUserId);
transactionRouter.delete('/transaction/:transactionId', transactionController.deleteTransaction);
//transactionRouter.get('/transaction/:transactionId', transactionController.getTransactionById);

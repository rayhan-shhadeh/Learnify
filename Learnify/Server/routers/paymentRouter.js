import express from 'express';
import { paymentController } from '../controllers/paymentCotroller.js';

export const paymentRouter = express.Router();

paymentRouter.post('/payment/process-payment/:userId',paymentController.processPayment);
paymentRouter.get('/payment/reachLimit/:userId',paymentController.reachLimit);



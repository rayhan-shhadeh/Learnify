import express from 'express';
import { userController } from '../controllers/authController.js';

export const userRouter = express.Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

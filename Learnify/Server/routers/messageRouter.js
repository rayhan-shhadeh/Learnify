import express from 'express';
import { messageController } from '../controllers/messageController.js';
export const messageRouter = express.Router();

// Messages
messageRouter.get('/messages/:id', messageController.getMessages);  
messageRouter.post('/messages/savemessage', messageController.saveMessage);

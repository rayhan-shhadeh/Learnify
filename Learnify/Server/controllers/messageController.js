import express from 'express';
import { messageService } from '../services/messageService.js';
export const messageController = {
    async saveMessage(req, res) {
        try {
            const newMessage = await messageService.saveMessage(req.body);

            res.status(200).json({
                status: 'success',
                data: newMessage,
            });
        }
        catch (error) {
            console.error('Error in saveMessage:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    },
    async getMessages(req, res) {
        try {
            const messages = await messageService.getMessages(req.params.id);
            res.status(200).json({
                status: 'success',
                data: messages,
            });
        }
        catch (error) {
            console.error('Error in getMessages:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    },
}


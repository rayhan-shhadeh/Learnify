import express from 'express';
import { calendarEventController } from '../controllers/calendarEventController.js';
export const calendarEventRouter = express.Router();

calendarEventRouter.post('/event',calendarEventController.createEvent);
calendarEventRouter.put('/event/:eventId',calendarEventController.updateEvent);
calendarEventRouter.delete('/event/:eventId',calendarEventController.deleteEvent);
calendarEventRouter.get('/event/:eventId',calendarEventController.getEventById);
calendarEventRouter.get('/user/events/:userId',calendarEventController.getAllEventsByUser);

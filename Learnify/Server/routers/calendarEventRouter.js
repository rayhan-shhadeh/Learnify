import express from 'express';
import { calendarEventController } from '../controllers/calendarEventController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const calendarEventRouter = express.Router();

calendarEventRouter.post('/event',calendarEventController.createEvent);
calendarEventRouter.put('/event/:eventId',authController.protect, restrictTo( 1,2), calendarEventController.updateEvent);
calendarEventRouter.delete('/event/:eventId',authController.protect, restrictTo( 1,2), calendarEventController.deleteEvent);
calendarEventRouter.get('/event/:eventId', authController.protect, restrictTo( 1,2),calendarEventController.getEventById);
calendarEventRouter.get('/user/events/:userId',authController.protect, restrictTo( 1,2), calendarEventController.getAllEventsByUser);

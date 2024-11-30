import { calendarEventService } from '../services/calendarEventService.js';
export const calendarEventController = {
    async createEvent(req, res) {
        try {
            const newEvent = await calendarEventService.createEvent(req.body);
            res.status(201).json(newEvent);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating event' });
        }
    },

    async updateEvent(req, res) {
        try {
            const updatedEvent = await calendarEventService.updateEvent(req.params.eventId, req.body);
            if (!updatedEvent) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json(updatedEvent);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error updating event' });
        }
    },

    async deleteEvent(req, res) {
        try {
            const deletedEvent = await calendarEventService.deleteEvent(req.params.eventId);
            if (!deletedEvent) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error deleting event' });
        }
    },

    async getEventById(req, res) {
        try {
            const eventId = req.params.eventId;
            const event = await calendarEventService.getEventById(eventId);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving event' });
        }
    },
    
    async getAllEventsByUser(req, res) {
        try {
            const userId = req.params.userId;
            const events = await calendarEventService.getAllEventsByUser(userId);
            if (!events || events.length === 0) {
                return res.status(404).json({ error: 'No events found for this user' });
            }
            res.status(200).json(events);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving events' });
        }
    },
};

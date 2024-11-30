import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const calendarEventService = {
    async createEvent(data) {
        return await prisma.calenderevent.create({
            data
        });
    },

    async updateEvent(eventId, data) {
        return await prisma.calenderevent.update({
            where: { eventId: parseInt(eventId) },
            data
        });
    },

    async deleteEvent(eventId) {
        return await prisma.calenderevent.delete({
            where: { eventId: parseInt(eventId) }
        });
    },

    async getEventById(eventId) {
        return await prisma.calenderevent.findUnique({
            where: { eventId: parseInt(eventId) }
        });
    },
    
    async getAllEventsByUser(userId) {
        return await prisma.calenderevent.findMany({
            where: { userid: parseInt(userId) }
        });
    }
};

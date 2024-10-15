import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const habitService = {
    async createHabit(data) {
        return await prisma.habit.create({
            data
        });
    },

    async updateHabit(id, data) {
        return await prisma.habit.update({
            where: { habitId: parseInt(id) },
            data
        });
    },

    async deleteHabit(id) {
        return await prisma.habit.delete({
            where: { habitId: parseInt(id) }
        });
    },

    async getHabitById(id) {
        return await prisma.habit.findUnique({
            where: { habitId: parseInt(id) }
        });
    },

    async getHabitsByUserId(userId) {
        return await prisma.habit.findMany({
            where: { userId: parseInt(userId) }
        });
    }
};

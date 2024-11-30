import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const flashcardService = {
    async createFlashcard(data) {
        return await prisma.flashcard.create({
            data
        });
    },

    async updateFlashcard(id, data) {
        return await prisma.flashcard.update({
            where: { flashcardId: parseInt(id) },
            data
        });
    },

    async deleteFlashcard(id) {
        return await prisma.flashcard.delete({
            where: { flashcardId: parseInt(id) }
        });
    },

    async getFlashcardById(id) {
        return await prisma.flashcard.findUnique({
            where: { flashcardId: parseInt(id) }
        });
    },

    async getFlashcardByQorA(QorA) {
        return await prisma.flashcard.findMany({
            where: { 
                OR:[
                    {flashcardQ: {contains: QorA }},
                    {flashcardA: {contains: QorA }}
                ]
            }
        });
    }
};
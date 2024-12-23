import { PrismaClient } from '@prisma/client';
import { reviewService } from "../services/reviewService.js";

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
        const review = await reviewService.getReviewByFlashcardId(id);

        if (review != null) {
            const reviewId = review.reviewId;
            await prisma.review.delete({
                where: { flashcardid: parseInt(id) , reviewId : parseInt(reviewId)}
            });
        }
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
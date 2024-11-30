import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const questionService = {
    async createQuestion(data) {
        return await prisma.question.create({
            data
        });
    },

    async deleteQuestion(id) {
        return await prisma.question.delete({
            where: { questionId: parseInt(id) }
        });
    },

    async getQuestionById (id){
        return await prisma.question.findUnique({
            where : { questionId: parseInt(id) }
        }
        )
    },

    async getQuestionsByQuizId(quizId) {
        try {
            // Use Prisma to fetch questions where the `quizId` matches
            return await prisma.question.findMany({
                where: {
                    quizId: quizId, // Filter questions by quizId
                },
            });
        } catch (error) {
            throw new Error('Error fetching questions by quizId: ' + error.message);
        }
    }
};

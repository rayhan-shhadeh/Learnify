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
            return await prisma.question.findMany({
                where: {
                    quizid: parseInt(quizId)
                },
            });
        } catch (error) {
            throw new Error('Error fetching questions by quizId: ' + error.message);
        }
    }
};

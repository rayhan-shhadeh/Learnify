import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const quizService = {
    async createQuiz(data) {
        return await prisma.quiz.create({
            data
        });
    },

    async deleteQuiz(id) {
        return await prisma.quiz.delete({
            where: { quizId: parseInt(id) }
        });
    },
    
    async getQuizById (id){
        return await prisma.quiz.findUnique( {
            where : { quizId: parseInt(id) }
        }
        )
    }
};

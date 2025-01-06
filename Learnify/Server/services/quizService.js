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
    },
    async getMaxQuizId (){
        const quiz = await prisma.quiz.findFirst({
            orderBy: {
                quizId: 'desc'
            },
            select: {
                quizId: true
            },
        });
        return quiz.quizId;
    },
    async getQuizzesByFileId(fileId) {
        return await prisma.quiz.findMany({
            where : { fileid: parseInt(fileId) }

        })
    },
    async updateQuizScore(id, data) {
        return await prisma.quiz.update({
          where: { quizId: parseInt(id) },
          data,
        });
      }
};

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
    
};

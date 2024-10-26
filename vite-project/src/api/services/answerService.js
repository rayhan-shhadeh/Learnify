import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const answerService = {
    async createAnswer(data) {
        return await prisma.answer.create({
            data
        });
    },
    async updateAnswer(id, data) {
        return await prisma.answer.update({
            where: {answerId : parseInt(id) },
            data 
        });
    },
    async deleteAnswer(id) {
        console.log(id);
        return await prisma.answer.delete({
            where: { answerId: parseInt(id) }
        });
    },

    async getAnswerById (id){
        return await prisma.answer.findUnique( {
            where : { answerId: parseInt(id) }
        }
        );
    }
};

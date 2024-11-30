import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const topicService={
    async createTopic(data) {
                                   
        return await prisma.topic.create({
            data
        });
    },

    async getTopicByName(topicName) {
        return await prisma.topic.findFirst({
            where: { topicName }
        });
    },
    
    async deleteTopic(id){
        return prisma.topic.delete({
            where: { topicId: parseInt(id) }
        });
    }
};

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const topicService={
    async createTopic(data) {               
        return await prisma.topiclevel.create({
            data
        });
    },

    async getTopicByNameAndLevel(topicName,level) {
        return await prisma.topiclevel.findFirst({
            where :
            {
                topicName: topicName,    
                level: level, 
            },
        });
    },
    
    async deleteTopic(id){
        return prisma.topiclevel.delete({
            where: { topiclevelId: parseInt(id) }
        });
    }
};


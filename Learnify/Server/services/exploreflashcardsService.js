import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const exploreflashcardsService ={
    async getExploreFlashcardsByTopicId(topicId){
        return await prisma.exploreflashcard.findMany({
            where : { topicid: parseInt(topicId) } 
        });
        
    }, 

    async createExploreFlashcard(data){
        return await prisma.exploreflashcard.create({
            data
        });
    }, 
}
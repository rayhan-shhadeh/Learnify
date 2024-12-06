import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient(); 
export const reviewService= {
    async getReviewByFlashcardId(flashcardid){
        return await prisma.review.findFirst({
            where:{
                flashcardid :parseInt(flashcardid)
            }
        });
    },
    async getByReviewDate(date){
        return await prisma.review.findMany({
        where:{
            nextReviewDate : date
        }
        });
    }
    ,
    async updateReview(reviewId,data){
        return await prisma.review.update({
            where: {reviewId : parseInt(reviewId)},
                data 
        });
            
    },
    async createReview(data) {                      
        return await prisma.review.create({
            data
        });
    },
    async getReviewByFlashcardid(flashcardId) {                      
        return await prisma.review.findFirst({
            where:{
                flashcardid :flashcardId
            }        
        });
    }
}


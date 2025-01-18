import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const paymentService ={
  async createCard(data) {
    try {
      const existingCard = await prisma.card.findFirst({
        where: { cardNumber: data.cardNumber }
      });
      if (existingCard) {
        return existingCard;
      }
      return await prisma.card.create({ data});
    } catch (error) {
      console.error("Create Card Error:", error.message);
      throw error;
    }
  },    
   async createTransaction(data){
    return await prisma.transaction.create({
      data
    })
   },
  }
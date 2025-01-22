import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cardService ={
    async getCardsByUserID (userId) {
        return await prisma.card.findMany({
          where: { userid: parseInt(userId) }
        });
    },
    async deleteCard  (cardId) {
        return await prisma.card.delete({
          where: { cardId: parseInt(cardId )}
        });
    },

    async getCardById(cardId) {
        return await prisma.card.findUnique({
          where: { cardId: parseInt(cardId ) },
        });
      },
    
}

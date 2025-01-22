import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const transactionService = {
    async getTransactionsByUserId(userId) {
        return await prisma.transaction.findFirst({
          where: { userid: parseInt(userId) },
          orderBy: {
            createdAt: 'desc',
          },
        });
    },
      
    async deleteTransaction(transactionId) {
        return await prisma.transaction.delete({
        where: { transactionId: transactionId },
        });
    },
/*
    async getTransactionById(transactionId) {
        return await prisma.transaction.findUnique({
        where: { transactionId: parseInt(transactionId) },
        });
    },
    */
};

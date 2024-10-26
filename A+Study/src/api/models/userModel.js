import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userModel = {
    createUser: async (data) => {
        return await prisma.user_.create({ data });
    },
    getUserByEmail: async (email) => {
        return await prisma.user_.findUnique({ where: { email } });
    }
};

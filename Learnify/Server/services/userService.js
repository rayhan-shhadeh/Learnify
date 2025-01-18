import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userService = {
    async getUserData(id) {
        return await prisma.user_.findUnique({
            where: { userId: parseInt(id) }
        });
    },
    async getAllUsers() {
        return await prisma.user_.findMany();
    },
    async createUser(user) {
        return await prisma.user_.create({
            data: user
        });
    },
    async updateUser(id, user) {
        return await prisma.user_.update({
            where: { userId: id },
            data: user
        });
    },
    async deleteUser(id) {
        return await prisma.user_.delete({
            where: { userId: id }
        });
    },
    // get user Id based on username
    async getUserIdByUsername(username) {
        return await prisma.user_.findFirst({
            where: { username: username },
            select: { userId: true },
            data: userId
        }
    );
    
        
    }

    };

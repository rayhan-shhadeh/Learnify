import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const userService = {
    async registerUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await prisma.user_.create({
            data: {
                ...data,
                password: hashedPassword
            }
        });
    },

    async findUserByEmail(email) {
        return await prisma.user_.findUnique({
            where: { email }
        });
    },

    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};

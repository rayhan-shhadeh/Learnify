import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const courseService = {
    async createCourse(data) {
        return await prisma.course.create({
            data
        });
    },

    async updateCourse(id, data) {
        return await prisma.course.update({
            where: { courseId: parseInt(id) },
            data
        });
    },

    async deleteCourse(id) {
        return await prisma.course.delete({
            where: { courseId: parseInt(id) }
        });
    },

    async getCourseById(id) {
        return await prisma.course.findUnique({
            where: { courseId: parseInt(id) }
        });
    }
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const statisticsService = {
    async getFlashcardsCount(userId) {
        return await prisma.flashcard.count({
            where: {
                file: {
                    course: {
                        userid: parseInt(userId)
                    }
                }
            }
        });
    },

    async getKeytermsCount(userId) {
        return await prisma.keyterm.count({
            where: {
                file: {
                    course: {
                        userid: parseInt(userId)
                    }
                }
            }
        });
    },

    async getQuizzesCount(userId) {
        return await prisma.quiz.count({
            where: {
                file: {
                    course: {
                        userid:  parseInt(userId)
                    }
                }
            }
        });
    },

    async getExploreTopicsCount(userId) {
        return await prisma.explorehistory.count({
            where: {
                userid: parseInt(userId)
            }
        });
    },

    async getHabitsDoneTodayCount(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await prisma.trackhabit.count({
            where: {
                habit: {
                    userid:  parseInt(userId)
                },
                trackDate: {
                    gte: today
                }
            }
        });
    },

    async getHabitsCount(userId) {
        return await prisma.habit.count({
            where: {
                userid:  parseInt(userId)
            }
        });
    },

};


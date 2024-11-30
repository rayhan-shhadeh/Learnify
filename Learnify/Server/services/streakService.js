import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient(); 
export const streakService= {
    async getStreakByHabitId(habitId){
        return await prisma.streak.findUnique({
            where:{
                habitid :habitId
            }
        });
    },
    async createStreak(data){
        return await prisma.streak.create({
            data
        });
    },
    async updateStreak(streakId,data){
        return await prisma.streak.update({
            where: {streakId : parseInt(streakId) },
            data
        });
    },
    async restartStreak(habitid){
        return await prisma.streak.update({
            where: {
                habitid : parseInt(habitid),
            },
            data: {
                currentStreak: 0
            }
        });
    },
}

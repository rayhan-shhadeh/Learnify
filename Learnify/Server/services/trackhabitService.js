import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
export const trackHabitService={
    async markHabitAsComplete(data) {               
        return await prisma.trackhabit.create({
            data
        });
    },    
    async fetchLast() {
        return await prisma.trackhabit.findFirst({
            orderBy: {
                trackId: 'desc'
            }
        });
    },
    async getTrackhabitByDateAndHabitId(trackDate,habitid) {
        return await prisma.trackhabit.findFirst({
            where:{
                    habitid: habitid,
                    trackDate:trackDate
            }
        });
    },
};

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const exploreHistoryService = {
  async createExploreHistory(userId, topiclevelId, data) {
    const explorehistoryRecord = await prisma.explorehistory.findFirst({
      where: {
        topiclevelid: parseInt(topiclevelId),
        userid: parseInt(userId),
      },
    });
  
    if (explorehistoryRecord) {
      return await prisma.explorehistory.update({
        where: {
          historyId: explorehistoryRecord.historyId,
        },
        data: {
          searchedAt: new Date(),
        },
      });
    }
  
    return await prisma.explorehistory.create({
      data,
    });
  },

    async getExploreHistory(userId) {
    return await prisma.explorehistory.findMany({
      where: { userid : userId},
    });
  },
};

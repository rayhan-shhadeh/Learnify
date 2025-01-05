import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const messageService = {
    async  saveMessage(data) {
        //const { text, senderId, groupId } = req.body;
          const newMessage = await prisma.message.create({
            data
          });
          return newMessage;

      },
// Get all messages for a specific group
async  getMessages(id) {
    const  groupId  =id;
  
    const messages = await prisma.message.findMany({
        where: { groupId: parseInt(groupId) },
        include: {
          sender: true, // Include sender details
          group: true,  // Include group details
        },
        orderBy: {
          timestamp: 'asc',
        },
      });
    },

};


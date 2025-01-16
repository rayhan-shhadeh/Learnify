import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const groupService = {
    async createGroup(group) {
        return await prisma.group_.create({
            data: group
        });
    },
    async getGroupById(id) {
        return await prisma.group_.findUnique({
            where: { groupId: parseInt(id) }
        });
    },
    async getAllGroups() {
        return await prisma.group_.findMany();
    },
    async updateGroup(id, group) {
        return await prisma.group_.update({
            where: { groupId: parseInt(id) },
            data: group
        });
    },
    async deleteGroup(id) {
        return await prisma.group_.delete({
            where: { groupId: parseInt(id)}
        });
    },
    async getUsersInGroup(id) {
        const usersInGroup = await prisma.group_users.findMany({
            where: { groupId: parseInt(id) },
            select: { userId: true }
        });
        return usersInGroup.map(user => user.userId);
    },
    async getUsernamesInGroup(id) {
        const usersInGroup = await prisma.group_users.findMany({
            where: { groupId: parseInt(id) },
            select: { userId: true }
        });

        const userIds = usersInGroup.map(user_ => user_.userId);

        const users = await prisma.user_.findMany({
            where: { userId: { in: userIds } },
            select: { username: true }
        });

        return users.map(user => user.username);
    },
    /**
     * Adds users to a group.
     * @param {number} id - The ID of the group.
     * @param {Array<number>} userIds - The IDs of the users to add to the group.
     */
    async addUsersToGroup(id, userIds) {
        if (!Array.isArray(userIds)) {
          throw new TypeError('userIds must be an array');
        }
    
        const userPromises = userIds.map(userId => {
          return prisma.group_users.upsert({
            where: { 
                userId_groupId: {
                    userId: parseInt(userId) ,
                     groupId: parseInt(id) }
            },
            update: {},
            create: {
              userId: parseInt(userId),
              groupId: parseInt(id)
            }
           
          });
        });
    
        return await Promise.all(userPromises);
    },
    async removeUsersFromGroup(id, userId) {
        return await prisma.group_users.delete({
            where: { 
                userId_groupId: {
                    userId: parseInt(userId) ,
                     groupId: parseInt(id) }
            }
        });
        },
    async getGroupsForUser(userId) {
        return await prisma.group_users.findMany({
            where: { userId: parseInt(userId) },
            include: { group_: true }
        });
    }
    ,
    async getGroupsByAdminId(userId) {
        return await prisma.group_.findMany({
            where: { adminId: parseInt(userId) }
        });
    },
    async addUsersToGroupByUsernames(groupId, username) {
    
        
          const users = await Promise.all([
              (async () => {
                  const user = await prisma.user_.findFirst({
                    where: { username },
                  });
                  if (!user) {
                    throw new Error(`User with username ${username} not found`);
                  }
                  return user;
              })()
          ]);
        
         // return user id from username
            const userId = users[0].userId;
        
          await prisma.group_users.update({
            where: { id: parseInt(groupId), 
                AND: { userId: parseInt(userId) }
            },
            data: {
              userId: parseInt(userId),
              groupId: parseInt(groupId)
            // userId: parseInt(userId),
            }
            // update: {},
            // create: {
            //   userId: parseInt(userId),
            //   groupId: parseInt(groupId),
            // },

            });
       
          return { message: 'Users added to group successfully' };
    }    
};
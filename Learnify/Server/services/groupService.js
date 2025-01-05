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
        return await prisma.group_.findUnique({
            where: { groupId: parseInt(id) },
            include: { users: true }
        });
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
    
};
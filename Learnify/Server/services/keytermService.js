import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const keytermService = {
    async createKeyterm(data) {
        return await prisma.keyterm.create({
            data
        });
    },

    async updateKeyterm(id, data) {
        return await prisma.keyterm.update({
            where: { keytermId: parseInt(id) },
            data
        });
    },

    async deleteKeyterm(id) {
        return await prisma.keyterm.delete({
            where: { keytermId: parseInt(id) }
        });
    },

    async getKeytermById(id) {
        return await prisma.keyterm.findUnique({
            where: { keytermId: parseInt(id) }
        });
    },
    
    async getKeytermsByTermOrDef(termOrDef) {
        return await prisma.keyterm.findMany({
            where:{
                OR:[
                    { keytermText: {contains : termOrDef} },
                    { keytermDef : {contains : termOrDef} }
                ] 
            }
        });
    }
};


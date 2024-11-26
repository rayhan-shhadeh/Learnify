import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const fileService = {
    async upload(data){
        return await prisma.file.create({            
            data
        });
    },
    async updateFileDetails(fileId,data){
        return await prisma.file.update({
            where: { fileId: parseInt(fileId) },
            data
        });
    },
    async getFlashcardsByFileId(fileId){
        return await prisma.flashcard.findMany({
            where: { fileId : parseInt(fileId) }
        });
    },
    async getKeytermsByFileId(fileId){
        return await prisma.keyterm.findMany({
            where: { fileId : parseInt(fileId) }
        });
    },
    async getfilesByName(Name) {
        return await prisma.file.findMany({
            where: {fileName: { contains: Name} }            
        });
    },
    async deleteFile(id) {
        return await prisma.file.delete({
            where: { fileId: parseInt(id) }
        });
    },
}

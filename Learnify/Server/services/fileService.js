import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//import {updateReviewsForNewDeadline} from "../functions/practice.js";
export const fileService = {
    async upload(data){
        console.log("hi from uploader!!");
        return await prisma.file.create({            
            data
        });
    },
    async updateFileDetails(fileId,fileName){
        return await prisma.file.update({
            where: { fileId: parseInt(fileId) },
            data: { fileName: fileName }
        });
    },
    async updateFile(fileId,data){
        return await prisma.file.update({
            where: { fileId: parseInt(fileId) },
            data
        });
    },
    async getFlashcardsByFileId(fileId){
        return await prisma.flashcard.findMany({
            where: { fileid : parseInt(fileId) }
        });
    },
    async getKeytermsByFileId(fileId){
        return await prisma.keyterm.findMany({
            where: { fileid : parseInt(fileId) }
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

    async getFileById (fileId){
        return await prisma.file.findUnique( {
            where : { fileId : parseInt(fileId) }
        }
        )
    },
}

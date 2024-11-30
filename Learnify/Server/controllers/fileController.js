import {fileService } from '../services/fileService.js';
import { S3Client, PutObjectCommand ,DeleteObjectCommand} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { createJSONFile} from '../functions/createJsonObject.js';
const prisma = new PrismaClient();

export const fileController = {
    async uploadFile(req, res) {
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        try {
            const file = req.file;
            let { fileName, fileDeadline, courseId } = req.body;
            courseId =  parseInt(courseId);
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            // Define the S3 key and parameters
            const key = `pdfs/${fileName}`;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: file.buffer, 
                ContentType: 'application/pdf'
            };
            // Convert file buffer to base64
            //const base64Data = file.buffer.toString('base64');
            // Decode the base64 string
            //const buffer = Buffer.from(base64Data, 'base64');
            // Prepare S3 upload parameters
            // Upload the file to S3
            const command = new PutObjectCommand(params);
            await s3.send(command);
            // Construct the file URL
            const fileURL = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
            const preparedFile = createJSONFile(fileName,fileDeadline,fileURL,courseId);
            const newFile = fileService.upload(preparedFile);
            if (newFile){
                res.status(200).json({
                    message: 'File uploaded successfully',
                    "fileUrl" :fileURL 
                });
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            res.status(500).json({ message: 'File upload failed', error: error.message });
        }
    },

    async getFileById(req, res) {
        try {
            const fileId = req.params.fileId;
            const file = await fileService.getFileById(fileId);
            if (!file) {
                return res.status(404).json({ error: 'file not found' });
            }
            res.status(200).json(file);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving file' });
        }
    },

    async updateFileDetails(req, res) {
        try {
            const updatedFile = await fileService.updateFileDetails(req.params.fileId, req.body);
            if (!updatedFile) {
                return res.status(404).json({ error: 'file not found' });
            }
            res.json(updatedFile);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error updating file' });
        }
    },

    async getFlashcardsByFileId(req, res) {
        try {
            const fileId = req.params.fileId;
            console.log(fileId);
            const flashcard = await fileService.getFlashcardsByFileId(fileId);
            if (!flashcard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.status(200).json(flashcard);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving flash card' });
        }
    },

    async getKeytermsByFileId(req, res) {
        try {
            const fileId = req.params.fileId;
            const Keyterm = await fileService.getKeytermsByFileId(fileId);
            if (!Keyterm) {
                return res.status(404).json({ error: 'term not found' });
            }
            res.status(200).json(Keyterm);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving term' });
        }
    },

    async getFilesByName(req,res){
        try {
            const Name = req.params.fileName;
            const file = await fileService.getfilesByName(Name);
            if (!file) {
                return res.status(404).json({ error: 'no files' });
            }
            res.status(200).json(file);
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Error' });
        }
    },
    
    async deleteFile(req, res) {
        const id = req.params.fileId;
        const fileId = parseInt(id);
        console.log(fileId);
        const obj = await prisma.file.findUnique({
            where: {
                fileId: fileId, 
            },
            select: {
                fileName: true,
            },
        });
        if(obj){ //to be sure that row exist in db 
            const s3 = new S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            try {
                const key = `pdfs/${obj.fileName}`;
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: key
                };
                await fileService.deleteFile(req.params.fileId);
                const command = new DeleteObjectCommand(params);
                await s3.send(command);
                return res.status(200).json({ message: 'File deleted successfully', file: obj.fileName});        
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'File deletion from s3 failed', error: error.message });
            }
        }
        else{
            return res.status(404).json({ error: 'Resource not found in database' });
        }
    },

}
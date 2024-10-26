import express from 'express';
import { fileController } from '../controllers/fileController.js';
export const fileRouter = express.Router();

import multer from 'multer';
const upload = multer();

// Define routes
fileRouter.get('/file/flashcards/:fileId', fileController.getFlashcardsByFileId);
fileRouter.get('/file/keyterms/:fileId', fileController.getKeytermsByFileId);
fileRouter.put('/file/:fileId', fileController.updateFileDetails);
fileRouter.get('/files/:fileName', fileController.getFilesByName);
fileRouter.post('/file/upload', upload.single('file'), fileController.uploadFile);
fileRouter.delete('/file/delete/:fileId',fileController.deleteFile );


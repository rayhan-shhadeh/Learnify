import express from 'express';
import { fileController } from '../controllers/fileController.js';
export const fileRouter = express.Router();

// Define routes
fileRouter.get('/file/flashcards/:fileId', fileController.getFlashcardsByFileId);
fileRouter.get('/file/keyterms/:fileId', fileController.getKeytermsByFileId);
fileRouter.put('/file/:fileId', fileController.updateFileDetails);
fileRouter.get('/files/:fileName', fileController.getFilesByName);

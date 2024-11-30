import express from 'express';
import { fileController } from '../controllers/fileController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const fileRouter = express.Router();
import multer from 'multer';
const upload = multer();

fileRouter.get('/file/flashcards/:fileId', authController.protect, restrictTo( 1,2),fileController.getFlashcardsByFileId);
fileRouter.get('/file/keyterms/:fileId',authController.protect, restrictTo( 1,2), fileController.getKeytermsByFileId);
fileRouter.put('/file/:fileId', authController.protect, restrictTo( 1,2),fileController.updateFileDetails);
fileRouter.get('/files/:fileName',authController.protect, restrictTo( 1,2), fileController.getFilesByName);
fileRouter.post('/file/upload',authController.protect, restrictTo( 1,2), upload.single('file'), fileController.uploadFile);
fileRouter.delete('/file/delete/:fileId',authController.protect, restrictTo( 1,2),fileController.deleteFile );
fileRouter.get('/file/:fileId',authController.protect, restrictTo( 1,2),fileController.getFileById);
import express from 'express';
import { courseController } from '../controllers/courseController.js';
import { authController } from '../controllers/authController.js';
import { restrictTo } from '../controllers/authController.js';
export const courseRouter = express.Router();

courseRouter.post('/course/', authController.protect, restrictTo( 1,2),courseController.createCourse);
courseRouter.put('/course/:id', authController.protect, restrictTo( 1,2),courseController.updateCourse);
courseRouter.delete('/course/:id', authController.protect, restrictTo( 1,2),courseController.deleteCourse);
courseRouter.get('/course/:id',authController.protect, restrictTo( 1,2), courseController.getCourseById);
courseRouter.get('/course/files/:id',authController.protect, restrictTo( 1,2), courseController.getFilesByCourseId);
courseRouter.get('/courses/:Name', authController.protect, restrictTo( 1,2),courseController.getCoursesByName);


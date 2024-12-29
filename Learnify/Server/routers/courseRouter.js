import express from 'express';
import { courseController } from '../controllers/courseController.js';
export const courseRouter = express.Router();

courseRouter.post('/course/',courseController.createCourse);
courseRouter.put('/course/:id',courseController.updateCourse);
courseRouter.delete('/course/:id',courseController.deleteCourse);
courseRouter.get('/course/:courseId',courseController.getCourseById);
courseRouter.get('/courses/:Name',courseController.getCoursesByName);
courseRouter.get('/user/courses/:userId',courseController.getCoursesByUserId);
courseRouter.get('/user/course/files/:courseId', courseController.getFilesByCourseId);

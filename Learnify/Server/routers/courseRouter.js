import express from 'express';
import { courseController } from '../controllers/courseController.js';
export const courseRouter = express.Router();
// Define routes
courseRouter.post('/course/', courseController.createCourse);
courseRouter.put('/course/:id', courseController.updateCourse);
courseRouter.delete('/course/:id', courseController.deleteCourse);
courseRouter.get('/course/:id', courseController.getCourseById);
courseRouter.get('/course/files/:id', courseController.getFilesByCourseId);
courseRouter.get('/courses/:Name', courseController.getCoursesByName);


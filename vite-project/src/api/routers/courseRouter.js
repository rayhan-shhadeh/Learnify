import express from 'express';
import { courseController } from '../controllers/courseController.js';
export const courseRouter = express.Router();

// Define routes
courseRouter.post('/courses', courseController.createCourse);
courseRouter.put('/courses/:id', courseController.updateCourse);
courseRouter.delete('/courses/:id', courseController.deleteCourse);
courseRouter.get('/courses/:id', courseController.getCourseById);
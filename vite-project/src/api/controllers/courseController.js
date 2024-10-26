import { courseService } from '../services/courseService.js';

export const courseController = {

    async createCourse(req, res) {
        try {
            const newCourse = await courseService.createCourse(req.body);
            res.status(201).json(newCourse);
        } catch (error) {
            res.status(500).json({ error: 'Error creating course' });
        }
    },

    async updateCourse(req, res) {
        try {
            const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
            if (!updatedCourse) {
                return res.status(404).json({ error: 'course not found' });
            }
            res.json(updatedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Error updating course' });
            console.log(error);
        }
    },

    async deleteCourse(req, res) {
        try {
            const deletedCourse = await courseService.deleteCourse(req.params.id);
            if (!deletedCourse) {
                return res.status(404).json({ error: 'course not found' });
            }
            res.json({ message: 'course deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting course' });
        }
    },

    async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const course = await courseService.getCourseById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving course' });
        }
    }
};

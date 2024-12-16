import { courseService } from '../services/courseService.js';

export const courseController = {
    async createCourse(req, res) {
        try {
            const newCourse = await courseService.createCourse(req.body);
            res.status(201).json(newCourse);
        } catch (error) {
            console.log(error);
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
            console.log(error);
            res.status(500).json({ error: 'Error updating course' });
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
            console.log(error);
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
            console.log(error);
            res.status(500).json({ error: 'Error retrieving course' });
        }
    },
    
    async getFilesByCourseId(req, res) {
        try {
            const courseId = req.params.id; 
            const files = await courseService.getFilesByCourseId(courseId);
            if (!files || files.length === 0) {
                return res.status(404).json({ message: 'No files found for this course.' });
            }
                res.status(200).json(files);
            } catch (error) {
                console.error('Error fetching files:', error);
                res.status(500).json({ error: 'Failed to retrieve files' });
            }
    },

    async getCoursesByName(req,res){
        try {
            const Name = req.params.Name;
            const course = await courseService.getCoursesByName(Name);
            if (!course) {
                return res.status(404).json({ error: 'no courses' });
            }
            res.status(200).json(course);
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Error' });
        }
    }, 
    async getCoursesByUserId(req, res) {
        try {
            const userId = req.params.userId; // Extract userId from the request parameters
            const courses = await courseService.getCoursesByUserId(userId); // Call service function to fetch courses by userId
            if (!courses || courses.length === 0) {
                return res.status(200).json({ error: 'No courses found for this user' });
            }
            res.status(200).json(courses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving courses' });
        }
    },
    async getFilesByCourseId(req, res) {
        try {
            const courseId = req.params.courseId;
            const files = await courseService.getFilesByCourseId(courseId);
            if (!files) {
                return res.status(200).json({ error: 'no files' });
            }
            res.status(200).json(files);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving files' });
        }
    }
};
    

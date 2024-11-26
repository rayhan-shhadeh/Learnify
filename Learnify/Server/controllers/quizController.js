import { quizService } from '../services/quizService.js';

export const quizController = {
    async createQuiz(req, res) {
        try {
            const newQuiz = await quizService.createQuiz(req.body);
            res.status(201).json(newQuiz);
        } catch (error) {
            res.status(500).json({ error: 'Error creating quiz' });
        }
    },

    async deleteQuiz(req, res) {
        try {
            const deletedQuiz = await quizService.deleteQuiz(req.params.id);
            if (!deletedQuiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }
            res.json({ message: 'Quiz deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting quiz' });
        }
    }

};

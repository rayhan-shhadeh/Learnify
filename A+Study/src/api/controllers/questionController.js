import { questionService } from '../services/questionService.js';

export const questionController = {
    async createQuestion(req, res) {
        try {
            const newQuestion = await questionService.createQuestion(req.body);
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(500).json({ error: 'Error creating question' });
            console.log(error);
        }
    },

    async deleteQuestion(req, res) {
        try {
            const deletedQuestion = await questionService.deleteQuestion(req.params.id);
            if (!deletedQuestion) {
                return res.status(404).json({ error: 'Question not found' });
            }
            res.json({ message: 'Question deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting question' });
        }
    },

};

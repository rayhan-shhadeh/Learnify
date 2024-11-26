import { answerService } from '../services/answerService.js';

export const answerController = {

    async createAnswer(req, res) {
        try {
            const newAnswer =await answerService.createAnswer(req.body);
            res.status(201).json(newAnswer);
        } catch (error) {
            res.status(500).json({ error: 'Error creating answer' });
        }
    },

    async updateAnswer(req, res) {
        try {
            const updatedAnswer = await answerService.updateAnswer(req.params.id, req.body);
            if (!updatedAnswer) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            res.json(updatedAnswer);
        } catch (error) {
            res.status(500).json({ error: 'Error updating resource' });
            console.log(error);
        }
    },

    async deleteAnswer(req, res) {
        try {
            const deletedAnswer = await answerService.deleteAnswer(req.params.id);
            if (!deletedAnswer) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            res.json({ message: 'Resource deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting resource' });
        }
    },
    async getAnswerById(req, res) {
        try {
            const answerId = req.params.id;
            const answer = await answerService.getAnswerById(answerId);
            if (!answer) {
                return res.status(404).json({ error: 'Answer not found' });
            }
            res.status(200).json(answer);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving answer' });
        }
    }
};


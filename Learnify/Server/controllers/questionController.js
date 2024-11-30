import { questionService } from '../services/questionService.js';

export const questionController = {
    async createQuestion(req, res) {
        try {
            const newQuestion = await questionService.createQuestion(req.body);
            res.status(201).json(newQuestion);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating question' });
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
            console.log(error);
            res.status(500).json({ error: 'Error deleting question' });
        }
    },
    async getQuestionById(req, res) {
        try {
            const questionId = req.params.id;
            const question = await questionService.getQuestionById(questionId);
            if (!question) {
                return res.status(404).json({ error: 'question not found' });
            }
            res.status(200).json(question);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving question' });
        }
    },
    async getQuestionsByQuizId(req, res) {
        try {
            const quizId = req.params.quizId; // Extract quizId from route parameters
            const questions = await questionService.getQuestionsByQuizId(quizId);
    
            if (!questions || questions.length === 0) {
                return res.status(404).json({ error: 'No questions found for this quiz' });
            }
            res.status(200).json(questions);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving questions for the quiz' });
        }
    }
};

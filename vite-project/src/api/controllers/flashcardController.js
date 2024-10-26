import { flashcardService } from '../services/flashcardService.js';

export const flashcardController = {
    async createFlashcard(req, res) {
        try {
            const newFlashCard = await flashcardService.createFlashcard(req.body);
            res.status(201).json(newFlashCard);
        } catch (error) {
            res.status(500).json({ error: 'Error creating flash card' });
            console.log(error);
        }
    },

    async updateFlashcard(req, res) {
        try {
            const updatedFlashCard = await flashcardService.updateFlashcard(req.params.id, req.body);
            if (!updatedFlashCard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.json(updatedFlashCard);
        } catch (error) {
            res.status(500).json({ error: 'Error updating flash card' });
        }
    },

    async deleteFlashcard(req, res) {
        try {
            const deletedFlashCard = await flashcardService.deleteFlashcard(req.params.id);
            if (!deletedFlashCard) {
                return res.status(404).json({ error: 'Flashcard not found' });
            }
            res.json({ message: 'Flashcard deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting flashcard' });
        }
    },
    async getFlashcardById(req, res) {
        try {
            const flashcardId = req.params.id;
            const flashcard = await flashcardService.getFlashcardById(flashcardId);
            if (!flashcard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.status(200).json(flashcard);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving flash card' });
        }
    }

};
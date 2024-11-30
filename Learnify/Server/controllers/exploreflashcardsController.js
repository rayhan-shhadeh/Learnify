import { exploreflashcardsService } from "../services/exploreflashcardsService.js";

export const exploreflashcardsController= {
    async getExploreFlashcardsByTopicId(req, res) {
        try {
            const topicId = req.params.topicId;
            const topic = await exploreflashcardsService.getExploreFlashcardsByTopicId(topicId);
            if (!topic) {
                return res.status(404).json({ error: 'explore flashcards not found' });
            }
            res.status(200).json(topic);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving explore flashcards' });
        }
    }
}

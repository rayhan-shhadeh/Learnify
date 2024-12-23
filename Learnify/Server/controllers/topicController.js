import { topicService } from "../services/topicService.js";

export const topicController={
    async createTopic(req, res) {
        try {
            const newTopic =await topicService.createTopic(req.body);
            res.status(201).json(newTopic);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating topic' });
        }
    },
    async getTopicByName(req, res) {
        try {
            const topicName = req.params.topicName;
            const topic = await topicService.getTopicByName(topicName);
            if (!topic) {
                return res.status(404).json({ error: 'topic not found' });
            }
            res.status(200).json(topic);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving topic' });
        }
    },
}
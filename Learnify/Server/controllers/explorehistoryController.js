
import { exploreHistoryService } from "../services/exploreHistoryService.js";
import { topicService } from "../services/topicService.js"; 

export const exploreHistoryController = {
  async getExploreHistory(req, res) {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId parameter is required." });
    }
    try {
      const exploreHistory = await exploreHistoryService.getExploreHistory(parseInt(userId));
      if (exploreHistory.length === 0) {
        return;
      }
      const detailedHistory = await Promise.all(
        exploreHistory.map(async (historyRecord) => {
          const topicLevel = await topicService.getTopicLevelById(historyRecord.topiclevelid);
          return {
            topiclevelId: historyRecord.topiclevelid,
            topic: topicLevel?.topicName || "Unknown",
            level: topicLevel?.level || "Unknown",
          };
        })
      );
      res.status(200).json(detailedHistory );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching history records." });
    }
  },
};

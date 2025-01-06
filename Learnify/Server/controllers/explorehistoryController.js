
import {exploreHistoryService} from '../services/exploreHistoryService.js';


export const exploreHistoryController={
    async getExploreHistory(req,res){
        const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: "userId parameter is required." });
    }
    try {
        const explorehistory = await exploreHistoryService.getExploreHistory(parseInt(userId));
        if (userHistory.length === 0) {
            return res.status(404).json({ message: "No history records found for this user." });
        }
        res.status(200).json({ explorehistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching history records." });
    }
    }
}
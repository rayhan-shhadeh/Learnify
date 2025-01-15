import { createJSONStatistics } from '../functions/createJsonObject.js';
import { statisticsService } from '../services/statisticsService.js';
export const statisticsController ={
    async userStatistics (req,res){
        try{
            const userId = req.params.userId;
            const flashcardsCount = await statisticsService.getFlashcardsCount(userId);
            const keytermsCount = await statisticsService.getKeytermsCount(userId) ;
            const quizzesCount = await statisticsService.getQuizzesCount(userId) ;
            const exploreTopicsCount = await statisticsService.getExploreTopicsCount(userId) ;
            const habitsDoneTodayCount= await statisticsService.getHabitsDoneTodayCount(userId);
            const habitsCount= await statisticsService.getHabitsCount(userId);
            const userStatistics= createJSONStatistics(flashcardsCount,keytermsCount,quizzesCount,exploreTopicsCount,habitsDoneTodayCount,habitsCount);
    
            res.status(201).json({userStatistics});
        }catch(error){
            console.log(error);
            res.status(500).json({ error});
        }
    }
};




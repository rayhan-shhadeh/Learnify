import { streakService } from "../services/streakService.js";
export const streakController ={
    async getStreakByUserIdAndHabitId(req,res){
        try {
            const habitId = parseInt(req.params.habitId);
            const streak = await streakService.getStreakByHabitId(habitId);
            if (!streak) {
                return res.status(404).json({ error: 'streak not found' });
            }
            res.status(200).json(streak);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving streak' });
        }
    },
    async restartStreak(req,res){
        try {
            const habitId = parseInt(req.params.habitId);
            const updatedStreak = await streakService.restartStreak(habitId);
            if (!updatedStreak) {
                return res.status(404).json({ error: 'streak not found' });
            }
            res.status(200).json(updatedStreak);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving streak' });
        }
    },


}
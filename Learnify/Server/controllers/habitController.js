import { habitService } from '../services/habitService.js';
import { streakService } from '../services/streakService.js';
import {createJSONStreak} from '../functions/createJsonObject.js'
export const habitController = {
    async createHabit(req, res) {
        try {
            const newHabit = await habitService.createHabit(req.body);
            //prepare streak data
            const habitId = newHabit.habitId;
            const currentStreak = 0;
            const longestStreak = 0;
            const lastUpdatedDate =  new Date().toISOString(); //currentDate
            //create streak for this habit
            const newStreak = createJSONStreak(habitId,currentStreak,longestStreak,lastUpdatedDate);//format json
            await streakService.createStreak(newStreak); //new record

            res.status(201).json(newHabit);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating habit' });
        }
    },

    async updateHabit(req, res) {
        try {
            const updatedHabit = await habitService.updateHabit(req.params.id, req.body);
            if (!updatedHabit) {
                return res.status(404).json({ error: 'Habit not found' });
            }
            res.json(updatedHabit);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error updating habit' });
        }
    },

    async deleteHabit(req, res) {
        try {
            const deletedHabit = await habitService.deleteHabit(req.params.id);
            if (!deletedHabit) {
                return res.status(404).json({ error: 'Habit not found' });
            }
            res.json({ message: 'Habit deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error deleting habit' });
        }
    },

    async getHabitById(req, res) {
        try {
            const habitId = req.params.id;
            const habit = await habitService.getHabitById(habitId);
            if (!habit) {
                return res.status(404).json({ error: 'Habit not found' });
            }
            res.status(200).json(habit);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving habit' });
        }
    },
    async getHabitsByUserId(req, res) {
        try {
            const userId = req.params.userId; // Extract quizId from route parameters
            const habits = await habitService.getHabitsByUserId(userId);
            if (!habits || habits.length === 0) {
                return res.status(404).json({ error: 'No habits found for this user' });
            }
            res.status(200).json(habits);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error retrieving habits for the user' });
        }
    }
};

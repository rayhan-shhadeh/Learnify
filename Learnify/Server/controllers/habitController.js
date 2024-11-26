import { habitService } from '../services/habitService.js';

export const habitController = {
    async createHabit(req, res) {
        try {
            const newHabit = await habitService.createHabit(req.body);
            res.status(201).json(newHabit);
        } catch (error) {
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
            res.status(500).json({ error: 'Error retrieving habit' });
            console.log(error);
        }
    },

};

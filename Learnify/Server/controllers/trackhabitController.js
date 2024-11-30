import {trackHabitService} from '../services/trackhabitService.js'
import{createJSONCompletion,createJSONStreak,createJSONTrack,createJSONHabitStatus} from '../functions/createJsonObject.js'
import { streakService } from '../services/streakService.js';
import {generateDateArray} from '../functions/date.js'
import { habitCount } from '../functions/habit.js';
import { habitService } from '../services/habitService.js';
export const trackHabitController={
    async markHabitAsComplete(req, res) {
        try {
            //update trackhabit table 
            //prepare data
            const habitId = parseInt(req.params.habitId) ;
            const trackDate = new Date().toISOString();
            const isComplete = true ;
            //format json data
            const newCompletionJSONData = createJSONCompletion(habitId,trackDate,isComplete);
            //create new record 
            const newCompletion = await trackHabitService.markHabitAsComplete(newCompletionJSONData);
            //streak table
            const streak = await streakService.getStreakByHabitId(habitId);
  
            
                //yesterday date
                const today = new Date();
                const yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0] + 'T00:00:00.000Z';
                //streak data
                const streakId = streak.streakId;
                let currentStreak = streak.currentStreak;
                let longestStreak = streak.longestStreak;
                let lastUpdatedDate = streak.lastUpdatedDate.toISOString();
                //increment streak or restart
                if(lastUpdatedDate === yesterday)
                {
                    currentStreak = streak.currentStreak++;
                }
                else{
                    currentStreak = 0 ; 
                }
                //check longestStreak
                if(currentStreak > longestStreak){
                    longestStreak = currentStreak ;
                }
                lastUpdatedDate=new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
                const updatedStreak = createJSONStreak(habitId,currentStreak,longestStreak,lastUpdatedDate);//format json
                streakService.updateStreak(streakId,updatedStreak);
            
            res.status(201).json(newCompletion);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating newCompleion' });
        }
    },
    async weeklyTracker(req, res) {
    try{
        let jsonArray = [];
        let jsonTrack ;
        let track
        //get start and end from request
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        const habitId = parseInt(req.params.habitId);
        console.log(habitId);
        //format the data to yyyy-mm-dd format
        startDate = new Date(startDate).toISOString().split('T')[0];
        endDate = new Date(endDate).toISOString().split('T')[0];
        //array of dates in week
        const arrayOfDates = generateDateArray(startDate, endDate);
        //for loop to get complete status of each day
        for (const trackDate of arrayOfDates) {
            track = await trackHabitService.getTrackhabitByDateAndHabitId(new Date(trackDate),habitId);
            console.log(track);
            jsonTrack = createJSONTrack(trackDate, track ? 1 : 0);
            jsonArray.push(jsonTrack);
        }
        res.status(201).json(jsonArray);
    }catch (error){
        console.log(error);
        res.status(500).json({ error: 'Error creating weekly report' });
    }
    },
    async monthlyTracker(req, res) {
        try {
            //get year,month from request body
            const habitId = parseInt(req.params.habitId);
            const year = parseInt(req.body.year);
            const month = parseInt(req.body.month);
            let jsonArray = [];
            //get first and last day in month
            const startDate = new Date(Date.UTC(year, month - 1, 1));
            const endDate = new Date(Date.UTC(year, month, 0));
            //array of dates in month
            const arrayOfDates = generateDateArray(startDate, endDate);
            //for loop to get complete status of each day in month
            for (const trackDate of arrayOfDates) {
                const track = await trackHabitService.getTrackhabitByDateAndHabitId(new Date(trackDate), habitId);
                const jsonTrack = createJSONTrack(trackDate, track ? 1 : 0);
                jsonArray.push(jsonTrack);
            }
            console.log(jsonArray);
            res.status(201).json(jsonArray);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating monthly report' });
        }
    },
    async allHabitsTracker(req, res){
        try{
            let allHabitsStatusArary =[];
            const userId = parseInt(req.params.userId);
            const year = parseInt(req.body.year);
            const month = parseInt(req.body.month);
            //get all habits array
            const habits = await habitService.getHabitsByUserId(userId);
            //get all habits id array
            const habitsIds = habits.map(item => item.habitId);
            //for loop to track status of all habits in one month for specific user
            for(const habitId of habitsIds){
                const count = await habitCount(habitId,month,year);
                const habit = await habitService.getHabitById(habitId);
                const habitName = habit.habitName;
                const habitStatus = createJSONHabitStatus(habitName,count)
                allHabitsStatusArary.push(habitStatus);
            }
            res.status(201).json(allHabitsStatusArary);
        }catch(error){
            console.error(error);
            res.status(500).json({ error: 'Error creating monthly report' });
        }
    }  
}


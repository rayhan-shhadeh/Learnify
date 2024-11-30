import { generateDateArray } from "./date.js";
import { trackHabitService } from "../services/trackhabitService.js";

export async function habitCount(habitId,month,year){
    let count =0 ;
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    //array of dates in month
    const arrayOfDates = generateDateArray(startDate, endDate);
    //for loop to get complete status of each day in month
    for (const trackDate of arrayOfDates) {
        const track = await trackHabitService.getTrackhabitByDateAndHabitId(new Date(trackDate), habitId);
        if(track){
            count++;
        }
    }
    return count;
}
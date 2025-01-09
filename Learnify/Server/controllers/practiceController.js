import { createJSONReview} from "../functions/createJsonObject.js";
import { differenceInDays } from "../functions/date.js";
import { fileService } from "../services/fileService.js";
import { flashcardService } from "../services/flashcardService.js";
import { reviewService } from "../services/reviewService.js";
let currentDate = new Date();
const ISOcurrentDate= new Date().toISOString(); 

export const practiceController={
    async updateReview(req,res){
        try {
            const rating= req.body.rating;
            const flshcardId = req.params.flashcardId;
            const flashcard = await flashcardService.getFlashcardById(flshcardId);
            const fileId = flashcard.fileid ;
            //get fileDeadline
            const file = await fileService.getFileById(fileId); 
            const fileDeadline = file.fileDeadline;
            //get review record for flashcard
            const review = await reviewService.getReviewByFlashcardId(flshcardId);
            const repetitions = review.repetitions;
            const reviewId = review.reviewId;
            let easeFactor = review.easeFactor || 2.5 ;
            let interval = review.interval || 1;
            //remainingDays of file deadline
            const remainingDays= differenceInDays(currentDate,fileDeadline);
            console.log(remainingDays);
            //easeFactor calculations based on SM2 algorithm 
            easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
            if (easeFactor < 1.3) easeFactor = 1.3;
            if (repetitions+1 <= 1) {
                interval = 1;
            } else if (repetitions+1 === 2) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            //nextReviewDate calculation 
            let nextReviewDate;
            //if the interval > remainingDays put the next review on the deadline end 
            if(interval>remainingDays){
                nextReviewDate = fileDeadline.toISOString();
            }
            else{
                const tempDate = new Date(currentDate); //clone
                tempDate.setDate(currentDate.getDate() + interval);
                nextReviewDate = tempDate.toISOString();    
            } 
            //update review record 
            const JSONReview = createJSONReview(flshcardId,interval,repetitions+1,nextReviewDate);
            const updatedReview = await reviewService.updateReview(reviewId,JSONReview);
            //response
            res.status(201).json(updatedReview);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error in updating review !' });
        }
    },
    async fetchFlashcardsForPractice(req,res){
    try{
        const fileId = req.params.fileId;
        const file = await fileService.getFileById(fileId);
        const fileDeadline = file.fileDeadline;
        if(currentDate>fileDeadline){
            res.status(201).json("The Deadline is end!!");
        }
        else{
        let practiceFlashcardsArray=[];
        let flashcardIds;
        let practiceCount = file.practiceCount;
        if(practiceCount == 0){
            //get all flashcards to practice
            practiceFlashcardsArray = await fileService.getFlashcardsByFileId(fileId);
            flashcardIds= practiceFlashcardsArray.map(item => item.flashcardId);
            //create review record for all flashcards
            for(const flashcardId of flashcardIds){
                const JSONReview = createJSONReview(flashcardId,0,0,ISOcurrentDate,2.5);
                await reviewService.createReview(JSONReview);
            }
        }
        else{
            //get flashcards ids where nextReviewDate == currentDate
            const reviews = await reviewService.getByReviewDate(currentDate,fileId);
            //get these flashcards by thier ids 
            const flashcardIds = reviews.map(item => item.flashcardId);
            for(const flashcardId of flashcardIds){
               const flashcard  = await flashcardService.getFlashcardById(flashcardId);
               practiceFlashcardsArray.push(flashcard);
            }    
        }
        //response 
        if(practiceFlashcardsArray.length === 0){
            res.status(201).json("No flashcards for practice today for "+file.fileName+" file!");
            return;
        }
        await fileService.updateFile(file.fileId, {
            ...file,
            practiceCount: ++practiceCount
        });
        res.status(201).json(practiceFlashcardsArray);
        } 
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error in fetching flashcards for practice !' });
    }
    }
}


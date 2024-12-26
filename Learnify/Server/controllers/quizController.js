import { quizService } from '../services/quizService.js';
import { questionService } from '../services/questionService.js';
import { fileService } from '../services/fileService.js';
import {downloadPDF,deletePDF} from '../functions/pdfHandling.js';
import {OpenAIPromptHandling}  from '../functions/openAIPromptHandling.js';
import {createJSONQuiz,createJSONQuestion} from '../functions/createJsonObject.js'
import {isArrayOfJSONObjects,isJSONObject,isArrayOfStrings} from '../functions/validateFormat.js'
// Tala 2: I added my laptop path to the myPath variable
const myPath ="C:\\Users\\rshha\\Documents\\VSCode\\projects\\Graduation-v7\\Learnify\\Server\\TempPDFs\\";
export const quizController = {
    async generateQuiz(req, res) {
        try {
            //file info
            const file = await fileService.getFileById(req.params.fileid);
            const filename = file.fileName;
            const fileurl = file.fileURL;
            const numOfQuestions = req.body.numOfQuestions ;
            const level = req.body.level ;
            const fileid = file.fileId ;
            //prepare prompt and full path
            const prompt = 'Create a quiz to ask '+level+ numOfQuestions 
            +'MCQ questions based on the attached file in the followingJSON format:' 
            +' {"title":"Quiz Topic","description":"A brief overview of the quiz"'
            +'"questions":[{"questionText":"first question here?","correctAnswer":"A"'
            +'"choices":["Answer A","Answer B","Answer C","Answer D"]}'
            +'{"questionText":"second question here?","correctAnswer":"B"'
            +'"choices":["Answer A","Answer B","Answer C","Answer D"]},...]}'
            +' please make sure that the title,description,and questions is related to the attached file'
            +' without any additional text before or after the JSON object and without ```json```.';
            const fullPath = myPath+filename;
            //download pdf, send to openAI, delete pdf
            await downloadPDF(fileurl , process.env.SAVE_PATH ,filename);//url, savePath, filename
            const response = await OpenAIPromptHandling(fullPath,prompt); //filename,prompt
            await deletePDF(fullPath);
            //parse response as 
            console.log(response);
            const jsonResponse = JSON.parse(response);
            //validate
            if(!isJSONObject(jsonResponse)){
                throw new Error("Something went wrong in response from openai api!");
            }
            const quizTitle = jsonResponse.title ;
            const quizDescription = jsonResponse.description ;
            const questionsArray = jsonResponse.questions;
            if(!isArrayOfJSONObjects(questionsArray)){
                throw new Error("Something went wrong in response from openai api!");
            }
            //store quiz
            
            const JSONQuiz =  createJSONQuiz(numOfQuestions,quizTitle,quizDescription,fileid,2);//userid from me
            const createdQuiz = await quizService.createQuiz(JSONQuiz);
            const quizid = createdQuiz.quizId;
            //store questions
            questionsArray.forEach(question=>{
                const choices = question.choices;
                if(!isArrayOfStrings(choices)){
                    throw new Error("Something went wrong in response from openai api!");
                }
                const JSONQuestion= createJSONQuestion(question.questionText,question.correctAnswer,'"'+choices+'"',quizid);
                questionService.createQuestion(JSONQuestion);
            });
            res.status(201).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating Quiz!!' });
        }
    },
    async deleteQuiz(req, res) {
        try {
            const deletedQuiz = await quizService.deleteQuiz(req.params.id);
            if (!deletedQuiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }
            res.json({ message: 'Quiz deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error deleting quiz' });
        }
    },
    async getQuizById(req, res) {
    try {
        const quizId = req.params.id;
        const quiz = await quizService.getQuizById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error retrieving quiz' });
    }
},
};

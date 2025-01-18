import { quizService } from '../services/quizService.js';
import { questionService } from '../services/questionService.js';
import { fileService } from '../services/fileService.js';
import {downloadPDF,deletePDF} from '../functions/pdfHandling.js';
import {OpenAIPromptHandling}  from '../functions/openAIPromptHandling.js';
import {createJSONQuiz,createJSONQuestion} from '../functions/createJsonObject.js'
import {isArrayOfJSONObjects,isJSONObject,isArrayOfStrings} from '../functions/validateFormat.js'
import { courseService } from '../services/courseService.js';
export const quizController = {
    async generateQuiz(req, res) {
        try {
            // file info
            const file = await fileService.getFileById(req.params.fileid);
            const filename = file.fileName;
            const fileurl = file.fileURL;
            const numOfQuestions = req.body.numOfQuestions;
            const level = req.body.level;
            const fileid = file.fileId;
            // prepare prompt and full path
            const prompt = 'Create a quiz to ask ' + level + numOfQuestions +
                ' MCQ questions based on the attached file in the following JSON format:' +
                ' {"title":"Quiz Topic","description":"A brief overview of the quiz",' +
                '"questions":[{"questionText":"first question here?","correctAnswer":"A",' +
                '"choices":["Answer A","Answer B","Answer C","Answer D"]},' +
                '{"questionText":"second question here?","correctAnswer":"B",' +
                '"choices":["Answer A","Answer B","Answer C","Answer D"]},...]}' +
                ' please make sure that the title, description, and questions are related to the attached file' +
                ' without any additional text before or after the JSON object and without ```json```.';
            const fullPath = process.env.SAVE_PATH + filename;
            // download pdf, send to OpenAI, delete pdf
            await downloadPDF(fileurl, process.env.SAVE_PATH, filename); // url, savePath, filename
            const response = await OpenAIPromptHandling(fullPath, prompt); // filename, prompt
            await deletePDF(fullPath);
            // parse response
            console.log(response);
            const jsonResponse = JSON.parse(response);
            // validate
            if (!isJSONObject(jsonResponse)) {
                throw new Error("Something went wrong in response from OpenAI API!");
            }
            const quizTitle = jsonResponse.title;
            const quizDescription = jsonResponse.description;
            const questionsArray = jsonResponse.questions;
            if (!isArrayOfJSONObjects(questionsArray)) {
                throw new Error("Something went wrong in response from OpenAI API!");
            }
            // store quiz
            const JSONQuiz = createJSONQuiz(numOfQuestions, quizTitle, quizDescription, fileid); // userid from me
            const createdQuiz = await quizService.createQuiz(JSONQuiz);
            const quizid = createdQuiz.quizId;
            // store questions and inject IDs into the response
            for (let question of questionsArray) {
                const choices = question.choices;
                if (!isArrayOfStrings(choices)) {
                    throw new Error("Something went wrong in response from OpenAI API!");
                }
                const JSONQuestion = createJSONQuestion(question.questionText, question.correctAnswer, '"' + choices + '"', quizid);
                const createdQuestion = await questionService.createQuestion(JSONQuestion);
                question.questionId = createdQuestion.questionId; // inject the question ID into the response
            }
            // include question IDs in the final response
            jsonResponse.questions = questionsArray;
            console.log("after parsing : " + jsonResponse);
            res.status(201).json(jsonResponse);
        } catch (error) {
            console.log(error);
            if (error instanceof SyntaxError) {
                console.error("JSON Syntax Error:", error.message);
                return res.status(500).json({ 
                  error: "Invalid JSON format", 
                  message: error.message, 
                  details: error.stack 
                });
            }
            else{
            res.status(500).json({ error: 'Error creating Quiz!!' });
            }
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
    async getMaxQuizId (req, res) {
    try {
        const maxQuizId = await quizService.getMaxQuizId();
        res.status(200).json({ maxQuizId });
    } catch (error) {
        console.error('Error fetching max quiz ID:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    },
    async getQuizHistory(req, res) {
        try {
            const userId = req.params.userId;
            const userCourses = await courseService.getCoursesByUserId(userId);
            if (!userCourses || userCourses.length === 0) {
                res.status(200).json({ quizzes: [] });
                return;
            }
    
            let userFiles = [];
            for (const course of userCourses) {
                const files = await courseService.getFilesByCourseId(course.courseId);
                if (files && files.length > 0) {
                    userFiles.push(...files);
                }
            }
            if (userFiles.length === 0) {
                res.status(200).json({ quizzes: [] });
                return;
            }
    
            let quizzes = [];
            for (const file of userFiles) {
                const fileQuizzes = await quizService.getQuizzesByFileId(file.fileId);
                if (fileQuizzes && fileQuizzes.length > 0) {
                    for (const quiz of fileQuizzes) {
                        const questions = await questionService.getQuestionsByQuizId(quiz.quizId);
                        if (!questions || questions.length === 0) {
                            await quizService.deleteQuiz(quiz.quizId);
                        } else {
                            quizzes.push(quiz);
                        }
                    }
                }
            }
            if (quizzes.length === 0) {
                res.status(200).json({ quizzes: [] });
                return;
            }
    
            const sortedQuizzes = quizzes.sort((a, b) => b.quizId - a.quizId);
            const topQuizzes = sortedQuizzes.slice(0, 5);
    
            const quizzesToDelete = sortedQuizzes.slice(5);
            for (const quiz of quizzesToDelete) {
                await quizService.deleteQuiz(quiz.quizId);
            }
    
            res.status(200).json({ quizzes: topQuizzes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching quiz history' });
        }
    },
            async updateQuizScore(req, res) {
        try {
            const updatedQuiz= await quizService.updateQuizScore(req.params.quizId, req.body);
            if (!updatedQuiz) {
                return;
            }
            res.json(updatedQuiz);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error updating course' });
        }
    }
};



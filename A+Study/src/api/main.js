import cors from 'cors';
import express from 'express';
import { answerRouter } from './routers/answerRouter.js';
import { courseRouter } from './routers/courseRouter.js';
import { flashcardRouter } from './routers/flashcardRouter.js';
import { habitRouter } from './routers/habitRouter.js';
import { keytermRouter } from './routers/keytermRouter.js';
import { questionRouter } from './routers/questionRouter.js';
import { quizRouter } from './routers/quizRouter.js';
import { userRouter } from './routers/userRouter.js';

import dotenv from 'dotenv';
import { calendarEventRouter } from './routers/calendarEventRouter.js';
import { fileRouter } from './routers/fileRouter.js';
dotenv.config();

// 2- adding open ai library after installing in using npm install openai 
const { Configuration, OpenAIApi } = require('openai');
//
const app = express();
// 3-
const openai = new OpenAIApi(new Configuration({
    apikey: proccess.env.OPENAI_API_KEY,
}));

app.use(cors()); 
// 4- 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use('/api',answerRouter);
app.use('/api',courseRouter);
app.use('/api',flashcardRouter);
app.use('/api',keytermRouter);
app.use('/api',habitRouter);
app.use('/api',questionRouter);
app.use('/api',quizRouter);
app.use('/api', userRouter);
app.use('/api',fileRouter);
app.use('/api',calendarEventRouter);
app.post('/api/chat', async (req, res) =>{
    const {message} = req.body;
    try{
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role:"user", content:message}],
        });

        res.json({reply: response.data.choices[0].message.content });

    }catch (error){
        console.error("Error communicating with ChatGPT", error);
        res.status(500).send("Error in processing your request");

    }
});

const PORT = process.env.PORT || 4000;
console.log(` here is the port ${PORT}`);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


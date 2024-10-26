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
const app = express();
app.use(cors()); 
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

const PORT = process.env.PORT || 4000;
console.log(` here is the port ${PORT}`);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

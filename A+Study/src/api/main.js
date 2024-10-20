import express from 'express';
import { answerRouter } from './routers/answerRouter.js';
import { courseRouter } from './routers/courseRouter.js';
import { flashcardRouter } from './routers/flashcardRouter.js';
import { keytermRouter } from './routers/keytermRouter.js';
import { habitRouter } from './routers/habitRouter.js';
import { questionRouter } from './routers/questionRouter.js';
import { quizRouter } from './routers/quizRouter.js';
import { fileRouter } from './routers/fileRouter.js';
import { calendarEventRouter } from './routers/calendarEventRouter.js';
const app = express();
app.use(express.json());
app.use('/api',answerRouter);
app.use('/api',courseRouter);
app.use('/api',flashcardRouter);
app.use('/api',keytermRouter);
app.use('/api',habitRouter);
app.use('/api',questionRouter);
app.use('/api',quizRouter);
app.use('/api',fileRouter);
app.use('/api',calendarEventRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

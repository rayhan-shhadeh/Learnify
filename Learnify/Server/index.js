import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
dotenv.config();
import cors from "cors";
import bodyParser from 'body-parser';
import "./utils/passportConfig.js";
import { answerRouter } from "./routers/answerRouter.js";
import { courseRouter } from "./routers/courseRouter.js";
import { flashcardRouter } from "./routers/flashcardRouter.js";
import { habitRouter } from "./routers/habitRouter.js";
import { keytermRouter } from "./routers/keytermRouter.js";
import { questionRouter } from "./routers/questionRouter.js";
import { quizRouter } from "./routers/quizRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { calendarEventRouter } from "./routers/calendarEventRouter.js";
import { fileRouter } from "./routers/fileRouter.js";
import { topicRouter } from "./routers/topicRouter.js";
import {exploreflashcardsRouter} from "./routers/exploreflashcardsRouter.js";
import {exploreRouter} from "./routers/exploreRouter.js"
import {trackHabitRouter} from "./routers/trackhabitRouter.js";
import {streakRouter} from "./routers/streakRouter.js";

const app = express();
const corsOption = {
  origin: [
    "http://localhost:5173",
   "http://localhost:8081",
    "http://0.0.0.0:8081",
   "http://192.168.68.58:8081",
   "http://192.168.68.58.19000"
    ],
  credentials: true,            //access-control-allow-credentials:true
  header:[ "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"],
  
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  exposedHeaders: "Content-Disposition",
  
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // This is important


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());


app.use("/api", answerRouter);
app.use("/api", courseRouter);
app.use("/api", flashcardRouter);
app.use("/api", keytermRouter);
app.use("/api", habitRouter);
app.use("/api", questionRouter);
app.use("/api", quizRouter);
app.use("/api", userRouter);
app.use("/api", fileRouter);
app.use("/api", calendarEventRouter);
app.use("/api", topicRouter);
app.use("/api",exploreflashcardsRouter);
app.use("/api",exploreRouter);
app.use("/api",trackHabitRouter)
app.use("/api",streakRouter)
app.use('/uploads', express.static('uploads'));

app.use(express.json());  // Make sure this is included

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});


app.listen(8080,'0.0.0.0', () => {
  console.log("Server is running on port 8080");
});

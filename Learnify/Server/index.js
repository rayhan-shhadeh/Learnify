import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import http from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';

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
import { groupRouter } from './routers/groupRouter.js';
import { messageRouter } from './routers/messageRouter.js';
import {practiceRouter} from "./routers/practiceRouter.js";
import {exploreHistoryRouter} from "./routers/exploreHistoryRouter.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}
});

const corsOption = {
  origin: [
    "http://localhost:5173",
   "http://localhost:8081",
    "http://0.0.0.0:8081",
    "http://192.168.68.53:8081",
    "http://0.0.0.0:8082",
    "http://192.168.68.53.19000",
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/test", (req, res) => {
  res.send("API is working"); 
});

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
app.use("/api",trackHabitRouter);
app.use("/api",streakRouter);
app.use("/api", groupRouter);
app.use("/api", messageRouter);
app.use("/api", practiceRouter);
app.use("/api", exploreHistoryRouter);
app.use('/uploads', express.static('uploads'));

app.use(express.json());  // Make sure this is included

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});
// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on("messageRoom", ({room, message}) => {
//     io.to(room).emit("message", message);
//   }
//   );
// socket.on("join", ({room, name}) => {
//   socket.join(room);
//   io.to(room).emit("message", `${name} has joined the room`);

// socket.on("disconnect", () => {
//   console.log("user disconnected");
// });

// });
// socketServer.js (Node.js with Socket.IO)

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", ({ groupId }) => {
    socket.join(groupId);
    console.log(`User joined group ${groupId}`);
  });

  socket.on("sendMessage",  async (messageData) => {
    const { text, senderId, groupId } = messageData;
    try {
      const response = await fetch('http://192.168.68.59:8080/api/messages/savemessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            senderId: parseInt(senderId),
            groupId: parseInt(groupId),
          }),
          });
      if (!response.ok) {
        throw new Error('Failed to save message');
      }
      const newMessage = await response.json();
    // now we need to send the message to the group
    io.to(groupId).emit("receiveMessage", newMessage);
    }
    catch (error) {
      console.error("Error sending message", error);
    }
     });

  socket.on("leave", ({ groupId }) => {
    socket.leave(groupId);
  });
});

server.listen(8080,"0.0.0.0", () => {
  console.log('listening on *:8080');
},
{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

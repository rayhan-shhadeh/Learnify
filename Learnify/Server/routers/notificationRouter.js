import express from "express";
import { sendNotificationHandler } from "../controllers/notificationController.js";

export const notificationRouter = express.Router();

notificationRouter.post("/send-notification", sendNotificationHandler);


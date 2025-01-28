import { sendPushNotification } from "../services/notificationService.js";

export const sendNotificationHandler = async (req, res) => {
  const { expoPushToken, title, body, data } = req.body;

  try {
    if (!expoPushToken || !title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await sendPushNotification(expoPushToken, title, body, data);
    res.status(200).json({ message: "Notification sent successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};

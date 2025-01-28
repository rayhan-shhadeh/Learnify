import { Expo } from "expo-server-sdk";

// Create a new Expo SDK client
const expo = new Expo();

export const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
  // Check if the push token is valid
  if (!Expo.isExpoPushToken(expoPushToken)) {
    throw new Error(`Invalid Expo push token: ${expoPushToken}`);
  }

  const messages = [
    {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data, // Custom data 
    },
  ];

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log("Push notification ticket:", ticketChunk);
    return ticketChunk;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

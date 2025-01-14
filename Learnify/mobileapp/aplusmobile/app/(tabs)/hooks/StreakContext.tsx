import API from "@/api/axois";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

interface StreakContextProps {
  streak: number;
  incrementStreak: () => void;
}

const StreakContext = createContext<StreakContextProps | undefined>(undefined);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [streak, setStreak] = useState(0);

  const incrementStreak = async () => {
    setStreak((prevStreak: number) => prevStreak + 1);
    // here to send the updated streak to the server on streak column in user table
    try {
      const storedUserId = await AsyncStorage.getItem("currentUserId");
      if (!storedUserId) {
        throw new Error("No user ID found in storage");
      }
      const response = await API.post(
        `/api/users/updateprofile/${storedUserId}`,
        {
          streak: streak,
        }
      );
      if (response.status !== 200) {
        throw new Error(`Failed to update streak: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error incrementing streak:", error.message);
      } else {
        console.error("Unexpected error incrementing streak:", error);
      }
    }
  };

  return (
    <StreakContext.Provider value={{ streak, incrementStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  if (Error instanceof Error) {
    console.error("Error incrementing streak:", Error.message);
  } else {
    console.error("Unexpected error incrementing streak:", Error);
  }
};

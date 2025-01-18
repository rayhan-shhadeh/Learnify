import React, { createContext, useContext, useState } from "react";
import StreakFire from "../streak/StreakFire";
import { ReactNode } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// get current user streak

const StreakContext = createContext({
  streak: 0,
  incrementStreak: () => {
    // show the streakFire animation
  },
});

export const StreakProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState(0);
  const [showStreakFire, setShowStreakFire] = useState(false);
  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
  };
  const handleAnimationEnd = () => {
    setShowStreakFire(false);
  };
  // render animation
  return (
    <StreakContext.Provider value={{ streak, incrementStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
};
function setShowStreakFire(arg0: boolean) {
  throw new Error("Function not implemented.");
  // show the streakFire animation
  Alert.alert("Streak Fire");
}

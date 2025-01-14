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

  const incrementStreak = () => {
    setStreak((prevStreak) => prevStreak + 1);
    // here to send the updated streak to the server
    fetch("/api/streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ streak: streak + 1 }),
    });
  };

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

import React, { useState } from "react";
import { View, Button } from "react-native";
import StreakFire from "./StreakFire";
import { useStreak } from "../hooks/StreakContext";

const StreakFireTest = () => {
  const { streak, incrementStreak } = useStreak();
  const [showStreakFire, setShowStreakFire] = useState(false);
  const [visible, setVisible] = useState(false);
  const increaseStreak = () => {
    incrementStreak();
    setVisible(true);
  };
  const handleAnimationEnd = () => {
    setShowStreakFire(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StreakFire
        streak={streak}
        visible={visible}
        onFinish={handleAnimationEnd}
      />
      ;
      <Button title="Increase Streak" onPress={incrementStreak} />
    </View>
  );
};

export default StreakFireTest;

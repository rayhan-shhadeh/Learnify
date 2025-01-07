import React, { useState } from "react";
import { View, Button } from "react-native";
import StreakFire from "./StreakFire";

const StreakFireTest = () => {
  const [streak, setStreak] = useState(1);
  const [showStreakFire, setShowStreakFire] = useState(false);
  const increaseStreak = () => {
    setStreak(streak + 1);
    setShowStreakFire(true);
  };
  const handleAnimationEnd = () => {
    setShowStreakFire(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StreakFire
        streak={streak}
        visible={true}
        onFinish={handleAnimationEnd}
      />
      ;
      <Button title="Increase Streak" onPress={increaseStreak} />
    </View>
  );
};

export default StreakFireTest;

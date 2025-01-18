import React from "react";
import { View, Text, Button } from "react-native";
import { useStreak } from "../(tabs)/hooks/StreakContext";
import StreakFire from "../(tabs)/streak/StreakFire";
// render the streak fire animation
const StreakFireTest = () => {
  const { streak } = useStreak();
  const [visible, setVisible] = React.useState(false);
  const handlePress = () => {
    setVisible(true);
  };
  handlePress();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StreakFire
        streak={streak}
        visible={true}
        onFinish={() => setVisible(false)}
      />
      <Button
        title="Increase Streak inside streak fire test"
        onPress={StreakFireTest}
      />
    </View>
  );
};
const TestComponent = () => {
  const { streak, incrementStreak } = useStreak();
  console.log("Streak Value:", streak);
  const [visible, setVisible] = React.useState(false);
  const handlePress = () => {
    // set streak value
    incrementStreak();
    setVisible(true);
    console.log("inside handle presss", streak);
    <StreakFireTest />;
  };
  return (
    <View>
      <Text>Streak Value: {streak}</Text>
      <View>
        <Button title="Increase Streak" onPress={handlePress} />
      </View>
    </View>
  );
};

export default TestComponent;

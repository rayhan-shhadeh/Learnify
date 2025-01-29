import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "./index"; // Your IndexScreen component
import FilesScreen from "./(tabs)/FilesScreen";
import HabitsScreen from "./(tabs)/Habits/HabitsScreen";
import StreakFireTest from "./(tabs)/streak/SreakFireTest";
import TestComponent from "./(tabs)/TestComponent";
import { StreakProvider } from "./(tabs)/hooks/StreakContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <StreakProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="IndexScreen"
          screenOptions={{ headerShown: true }}
        >
          <Stack.Screen name="IndexScreen" component={IndexScreen} />
          <Stack.Screen name="FilesScreen" component={FilesScreen} />
          <Stack.Screen name="HabitsScreen" component={HabitsScreen} />
          <Stack.Screen name="StrakFireTest" component={StreakFireTest} />
          <Stack.Screen name="TestComponent" component={TestComponent} />
        </Stack.Navigator>
      </NavigationContainer>
    </StreakProvider>
  );
};

export default App;

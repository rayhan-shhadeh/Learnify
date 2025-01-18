import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "./index"; // Your IndexScreen component
import FilesScreen from "./(tabs)/FilesScreen";
import PdfScreen from "./(tabs)/Files/PdfScreen";
import Habits from "./(tabs)/Habits/Habits";
import { StreakProvider } from "./(tabs)/hooks/StreakContext";
import HabitsScreen from "./(tabs)/Habits/HabitsScreen";
import StreakFireTest from "./(tabs)/streak/SreakFireTest";
import TestComponent from "./(tabs)/TestComponent";

const Stack = createStackNavigator();

const App = () => {
  return (
    <StreakProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="IndexScreen">
          <Stack.Screen
            name="IndexScreen"
            component={IndexScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FilesScreen"
            component={FilesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HabitsScreen"
            component={HabitsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StrakFireTest"
            component={StreakFireTest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TestComponent"
            component={TestComponent}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </StreakProvider>
  );
};

export default App;

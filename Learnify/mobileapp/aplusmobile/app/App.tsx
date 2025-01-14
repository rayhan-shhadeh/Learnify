import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "./index"; // Your IndexScreen component
import FilesScreen from "./(tabs)/FilesScreen";
import PdfScreen from "./(tabs)/Files/PdfScreen";
import { CoursesProvider } from "./(tabs)/hooks/CoursesContext";
import { StreakProvider } from "./(tabs)/hooks/StreakContext";
const Stack = createStackNavigator();

const App = () => {
  return (
    <CoursesProvider>
      {/* <StreakProvider> */}
      <NavigationContainer>
        {" "}
        {/* Keep NavigationContainer here */}
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
        </Stack.Navigator>
      </NavigationContainer>
      {/* </StreakProvider> */}
    </CoursesProvider>
  );
};

export default App;

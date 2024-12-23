import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IndexScreen from './index';  // Your IndexScreen component
import FilesScreen from './(tabs)/FilesScreen';
import PdfScreen from './(tabs)/Files/PdfScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>  {/* Keep NavigationContainer here */}
      <Stack.Navigator initialRouteName="IndexScreen">
        <Stack.Screen name="IndexScreen" component={IndexScreen} />
        <Stack.Screen name="FilesScreen" component={FilesScreen} />
        <Stack.Screen name="PdfScreen" component={PdfScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

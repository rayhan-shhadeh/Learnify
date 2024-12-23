import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CoursesProvider } from '../app/(tabs)/hooks/CoursesContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FilesScreen from './(tabs)/FilesScreen';
import PdfScreen from './(tabs)/Files/PdfScreen';

const Stack = createStackNavigator();

const IndexScreen = () => {
  const router = useRouter();
  const handleStartPress = () => {
    console.log("Start button pressed!");
    router.push("/(tabs)/auth/signin");
    // Add navigation or other logic here
  };

  return (
    <CoursesProvider>
    <LinearGradient
    colors={['#ddf3f5','#f7f7f7','#fbfbfb', '#9ad9ea']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/a-plus-4.gif")} // Replace with your logo path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartPress}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

    </LinearGradient>
    </CoursesProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150, // Adjust size as needed
  },
  button: {
    backgroundColor: "#1CA7EC",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 50, // To add space at the bottom
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default IndexScreen;

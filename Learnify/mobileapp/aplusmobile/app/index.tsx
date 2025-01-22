import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { usePushNotifications } from "../usePushNotifications";
const IndexScreen = () => {
  const router = useRouter();
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  const handleStartPress = () => {
    router.push("/(tabs)/auth/signin");
  };

  return (
    <LinearGradient
      colors={["#ddf3f5", "#f7f7f7", "#fbfbfb", "#9ad9ea"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text> Token: {expoPushToken?.data ?? ""}</Text>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/a-plus-4.gif")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartPress}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </LinearGradient>
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
    height: 150,
  },
  button: {
    backgroundColor: "#1CA7EC",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default IndexScreen;

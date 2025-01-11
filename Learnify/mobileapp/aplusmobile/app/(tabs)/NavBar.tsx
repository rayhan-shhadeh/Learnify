import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const NavBar = () => {
  const router = useRouter();
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push("/(tabs)/HomeScreen")}
      >
        <Icon name="home" size={24} color="#125488" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push("/(tabs)/chatting/GroupsScreen")}
      >
        <Icon name="comment-o" size={24} color="#888" />
        <Text style={styles.navTextInactive}>Groups</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        // /streak/StreakFire
        onPress={() => router.push("/profile")}
      >
        <Icon name="user-circle" size={24} color="#888" />
        <Text style={styles.navTextInactive}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push("/(tabs)/quiz/QuizReviewScreen")}
      >
        <Icon name="bar-chart" size={24} color="#888" />
        <Text style={styles.navTextInactive}>Habits</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push("/(tabs)/calendar/delete")}
      >
        <Icon name="calendar" size={24} color="#888" />
        <Text style={styles.navTextInactive}>Calendar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 80,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "#125488",
    fontSize: 12,
  },
  navTextInactive: {
    color: "#888",
    fontSize: 12,
  },
});

export default NavBar;

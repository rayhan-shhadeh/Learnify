import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API from "../../../api/axois";
import Back from "../Back";
import { router } from "expo-router";
const Header = () => {
  const colorScheme = useColorScheme(); // Detect light or dark theme
  const isDarkMode = colorScheme === "dark";

  const [userId, setUserId] = useState<string | null>(null);
  const [userProfilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "You are not logged in.");
          return;
        }

        const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
        setUserId(decoded?.id ?? null);

        const response = await API.get(`/api/users/getme/${decoded?.id}`);
        if (response.status === 200) {
          const data = await response.data.data;
          setProfilePhoto(data.photo);
          // Alert.alert(data.photo);
        } else {
          console.error("Failed to fetch user profile photo.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onProfilePhotoPress = () => {
    router.push("/(tabs)/profile/profile");
  };

  const dynamicStyles = isDarkMode ? darkStyles : lightStyles; // Choose styles based on theme

  return (
    <View style={[styles.headerContainer, dynamicStyles.headerContainer]}>
      {/* Notification Icon with Badge */}
      <Back
        title={""}
        onBackPress={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      {/* <Ionicons
        name="arrow-back-circle-sharp"
        size={35}
        color={isDarkMode ? "#fff" : "#1ca7ec"}
      /> */}
      {/* {notificationCount > 0 && (
          <View style={[styles.badge, dynamicStyles.badge]}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )} */}
      {/* Profile Photo or Placeholder */}
      <TouchableOpacity onPress={onProfilePhotoPress}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isDarkMode ? "#fff" : "#000"}
          />
        ) : userProfilePhoto ? (
          <Image
            source={{ uri: userProfilePhoto }}
            style={styles.profilePhoto}
          />
        ) : (
          <Ionicons name="person-circle-outline" size={32} color="#647987" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "transparent",
  },
  badge: {
    backgroundColor: "red",
  },
});

const darkStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#333",
  },
  badge: {
    backgroundColor: "orange",
  },
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow}
  },
  notificationContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default Header;

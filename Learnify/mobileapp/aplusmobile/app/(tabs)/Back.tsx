import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CustomToolbarProps {
  title: string;
  onBackPress: () => void;
}

const Back: React.FC<CustomToolbarProps> = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialCommunityIcons
          style={styles.backText}
          name="arrow-left-circle"
          size={35}
          color="#1CA7EC"
        />
      </TouchableOpacity>
      <View style={styles.rightPlaceholder} />
      {/* <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#111517" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: 60,
    backgroundColor: "#transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    backgroundBlendMode: "transparent",
  },
  backButton: {
    padding: 5,
    backgroundColor: "transparent",
  },
  backText: {
    color: "#1CA7EC",
    fontSize: 40,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  rightPlaceholder: {
    width: 30, // Placeholder for future icons or elements
  },
  notificationButton: {
    padding: 8,
    position: "absolute",
    top: 16,
    right: 16,
  },
});

export default Back;

import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  profilePhoto: string;
  onNotificationPress: () => void;
}

const Header: React.FC<HeaderProps> = ({
  profilePhoto,
  onNotificationPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
      <TouchableOpacity onPress={onNotificationPress}>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;

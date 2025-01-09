import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LinkListScreen = () => {
  const links: {
    name: string;
    icon: "link";
    url: string;
  }[] = [
    { name: "Link 1 ", icon: "link", url: "#" },
    { name: "Link 2 ", icon: "link", url: "#" },
    { name: "Link 3 ", icon: "link", url: "#" },
    { name: "Link 4 ", icon: "link", url: "#" },
    { name: "Link 5 ", icon: "link", url: "#" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>New extra Links for you!</Text>
      </View>

      {/* Link List Section */}
      <ScrollView style={styles.scrollContainer}>
        {links.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkCard}
            onPress={() =>
              console.log(
                `redirect to link from here just replace it: ${link.url}`
              )
            }
          >
            <Ionicons
              name={link.icon}
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.linkText}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    backgroundColor: "#1f93e0",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 20,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f93e0",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  linkCardHovered: {
    transform: [{ scale: 1.05 }],
  },
  icon: {
    marginRight: 15,
  },
  linkText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});

export default LinkListScreen;

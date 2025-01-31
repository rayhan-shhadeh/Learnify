import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import API from "@/api/axois";
import axios from "axios";
import { LOCALHOST } from "@/api/axois";
import Header from "./header/Header";
import { LinearGradient } from "expo-linear-gradient";
const LinkListScreen = () => {
  const { searchTopic, level } = useLocalSearchParams();
  const [links, setLinks] = useState<
    { resourceName: string; resourceLink: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const requestBody = {
          level: level,
        };
        console.log("level from links page: " + level);
        const response = await fetch(
          `http://${LOCALHOST}:8080/api/exploreflashcards/exploreMore/${searchTopic}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const linksData = await response.json();
        console.log("Fetched Data:", linksData);
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching links:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [searchTopic, level]);

  const handleLinkPress = async (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const supported = await Linking.canOpenURL(fullUrl);
    if (supported) {
      await Linking.openURL(fullUrl);
    } else {
      Alert.alert("Error", "Unable to open the link.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1f93e0" />
        <Text>Loading links...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Something went wrong while fetching links. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerText}>New Extra Links for You!</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {links.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkCard}
            onPress={() => {
              console.log("Redirecting to:", link.resourceLink);
              handleLinkPress(link.resourceLink);
            }}
          >
            <Ionicons
              name="link"
              size={24}
              color="#f5bf03"
              style={styles.icon}
            />

            <Text style={styles.linkText}>{link.resourceName}</Text>
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
  },
  icon: {
    marginRight: 15,
  },
  linkText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default LinkListScreen;

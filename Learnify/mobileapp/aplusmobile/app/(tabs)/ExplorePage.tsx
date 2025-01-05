import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../(tabs)/NavBar";
import Back from "./Back";

const data = [
  { id: "1", title: "OOP" },
  { id: "2", title: "DS" },
  { id: "3", title: "DOS" },
  { id: "4", title: "Software Engineering" },
  { id: "5", title: "102" },
  { id: "6", title: "AI" },
];

const randomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ["#4c669f", "#3b5998", "#192f6a"],
    ["#6a11cb", "#2575fc"],
    ["#00c6ff", "#0072ff"],
    ["#43cea2", "#185a9d"],
    ["#ff758c", "#ff7eb3"],
    ["#5f83b1", "#7BD5F5"],
    ["#787FF6", "#4ADEDE"],
    ["#1CA7EC", "#1F2F98"],
    ["#ffffff", "#5F83B1"],
    ["#21277B", "#9AD9EA"],
    ["#9AD9EA", "#006A67"],
    ["#92e1ff", "#4682b4"],
    ["#5f9ea0", "#ffffff"],
    ["#778899", "#5F83B1"],
    ["#708090", "#5F83B1"],
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface CardProps {
  title: string;
}

const Card: React.FC<CardProps> = ({ title }) => {
  const gradientColors = randomGradient();
  return (
    <TouchableOpacity style={styles.card}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Text style={styles.cardText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <Back
          title={""}
          onBackPress={function (): void {
            throw new Error("Function not implemented.");
          }}
        />{" "}
        Explore
      </Text>
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>Search</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        <FlatList
          horizontal
          data={data}
          renderItem={({ item }) => <Card title={item.title} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <FlatList
          horizontal
          data={data}
          renderItem={({ item }) => <Card title={item.title} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <FlatList
          horizontal
          data={data}
          renderItem={({ item }) => <Card title={item.title} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchText: {
    color: "#888",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExploreScreen;

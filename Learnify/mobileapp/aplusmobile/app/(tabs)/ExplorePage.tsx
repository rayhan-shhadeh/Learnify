import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../(tabs)/NavBar";
import Back from "./Back";
import API from "../../api/axois";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
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

const historyRandomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ["#2C3E50", "#1CA7EC"], // Dark blue and blue gradient (reliable and educational)
    ["#34495E", "#16A085"], // Dark teal and green gradient (calm and focused)
    ["#1F3A69", "#3498DB"], // Navy blue and light blue gradient (professional and calming)
    ["#8E44AD", "#9B59B6"], // Purple gradient (creative and engaging)
    ["#27AE60", "#2ECC71"], // Green gradient (fresh, calm, and encouraging)
    ["#D35400", "#F39C12"], // Orange gradient (energetic and motivating)
    ["#2980B9", "#6BB9F0"], // Blue gradient (serene and productive)
    ["#C0392B", "#E74C3C"], // Red gradient (urgent and impactful)
    ["#34495E", "#5D6D7E"], // Cool grey gradient (focused and professional)
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

const HistoryCard: React.FC<CardProps> = ({ title }) => {
  const router = useRouter();
  const gradientColors = historyRandomGradient();
  return (
    <>
      <TouchableOpacity style={styles.trashIcon}>
        <Icon name="trash-o" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/TopicScreen")}
      >
        <LinearGradient colors={gradientColors} style={styles.gradienthistory}>
          <Text style={styles.cardText}>{title}</Text>
          <Text style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#ffd335" />
            <Text> </Text>
            <Text style={styles.ratingText}>4.5</Text>
            <Text> </Text>
            <Icon name="bars" size={20} color="#ddd7e1" />
            <Text> </Text>
            <Text style={styles.ratingText}>20</Text>
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

const ExploreScreen = () => {
  const [popularTopics, setPopularTopics] = useState<string[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFilterSelect = (filter: string) => {
    console.log(`Selected filter: ${filter}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token not found");
          return;
        }

        let id = null;
        try {
          const decoded: { id: string } | null = jwtDecode<{ id: string }>(
            token
          );
          if (!decoded?.id) {
            Alert.alert("Error", "Invalid token structure");
            return;
          }
          id = decoded.id;

          setUserId(id); // Update userId state
        } catch (decodeError) {
          Alert.alert("Error", "Failed to decode token");
          return;
        }

        const userData = await API.get(`/api/users/getme/${id}`);
        const majorName = userData.data.major;

        const popularRes = await API.get(
          "/api/exploreflashcards/popularTopices"
        );
        const relatedRes = await API.get(
          `/api/exploreflashcards/relatedTopics/${id}`
        );
        const suggestedRes = await API.get(
          `/api/exploreflashcards/suggestedTopics/${majorName}`
        );

        setPopularTopics(popularRes.data);
        setRelatedTopics(relatedRes.data);
        setSuggestedTopics(suggestedRes.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
        Alert.alert("Error", "Failed to fetch topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CA7EC" />
        <Text style={styles.loadingText}>Preparing Topics For you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <Back title={""} onBackPress={() => console.log("Back pressed")} />{" "}
        Explore
      </Text>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search for a new topic"
            style={styles.searchText}
          >
            {" "}
            Search for new Topic
          </TextInput>
        </View>
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Icon name="filter" size={20} color="#888" />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleFilterSelect("Beginner")}
            >
              <Text style={styles.dropdownText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleFilterSelect("Medium")}
            >
              <Text style={styles.dropdownText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleFilterSelect("Advanced")}
            >
              <Text style={styles.dropdownText}>Advanced</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        <FlatList
          horizontal
          data={["History Topic 1", "History Topic 2", "History Topic 3"]}
          renderItem={({ item }) => <HistoryCard title={item} />}
          keyExtractor={(item, index) => `history-${index}`}
        />
      </View>
      {/* Suggested Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested</Text>
        <FlatList
          horizontal
          data={suggestedTopics}
          renderItem={({ item }) => <Card title={item} />}
          keyExtractor={(item, index) => `suggested-${index}`}
        />
      </View>

      {/* Related Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related</Text>
        <FlatList
          horizontal
          data={relatedTopics}
          renderItem={({ item }) => <Card title={item} />}
          keyExtractor={(item, index) => `related-${index}`}
        />
      </View>

      {/* Popular Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <FlatList
          horizontal
          data={popularTopics}
          renderItem={({ item }) => <Card title={item} />}
          keyExtractor={(item, index) => `popular-${index}`}
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
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 17,
    paddingTop: 10,
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
    width: "90%",
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
  gradienthistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
    top: 15,
    left: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9", // Light background to keep it clean and readable
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1CA7EC", // Matches the primary theme color
    fontWeight: "500",
  },
  trashIcon: {
    position: "absolute",
    bottom: 8,
    right: 15,
    zIndex: 1,
  },
  rating: {
    flex: 1,
    marginRight: 20,
    paddingRight: 30,
    position: "absolute",
    top: 40,
    left: 30,
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  ratingText: {
    color: "#ddd7e1",
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
    flexDirection: "row",
    flex: 1,
    top: 40,
    left: 20,
    marginLeft: 30,
    marginRight: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterIcon: {
    marginLeft: 10,
  },
  dropdownText: {
    color: "#000",
    fontSize: 16,
  },
});

export default ExploreScreen;

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
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../(tabs)/NavBar";
import Back from "./Back";
import API, { LOCALHOST } from "../../api/axois";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import Header from "./header/Header";
interface HistoryTopic {
  topic: string;
  topiclevelId: string;
  level: string;
}

const randomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ["#4E8BC4", "#96CBFC"], // Medium blue → light blue
    ["#96CBFC", "#C2E1FC"], // Light blue → softer pastel blue
    ["#4E8BC4", "#C2E1FC"], // Medium blue → soft pastel blue
    ["#FFC2D9", "#FF99BE"], // Soft pink → rich pastel pink
    ["#FF99BE", "#FFC2D9"], // Rich pastel pink → soft pink
    ["#FFC2D9", "#FEE3EC"], // Soft pink → light pastel pink
    ["#FF99BE", "#F4C9DA"], // Rich pastel pink → soft warm pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const historyRandomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ["#4E8BC4", "#96CBFC"], // Medium blue → light blue
    ["#96CBFC", "#C2E1FC"], // Light blue → softer pastel blue
    ["#4E8BC4", "#C2E1FC"], // Medium blue → soft pastel blue
    ["#FFC2D9", "#FF99BE"], // Soft pink → rich pastel pink
    ["#FF99BE", "#FFC2D9"], // Rich pastel pink → soft pink
    ["#FFC2D9", "#FEE3EC"], // Soft pink → light pastel pink
    ["#FF99BE", "#F4C9DA"], // Rich pastel pink → soft warm pink
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

interface CardProps {
  searchTopic: string;
  userId: string;
  setLoadingFlashcards: React.Dispatch<React.SetStateAction<boolean>>;
}

const Card: React.FC<CardProps> = ({
  searchTopic,
  userId,
  setLoadingFlashcards,
}) => {
  const gradientColors = randomGradient();
  const router = useRouter();
  const handleCardPress = async () => {
    try {
      setLoadingFlashcards(true);
      const requestBody = {
        level: "Medium",
        userId: userId,
      };
      const level = "Medium"; //to pass it to TopicScreen (from card)
      const response = await API.post(
        `/api/exploreflashcards/searchTopic/${searchTopic}`,
        requestBody
      );
      if (response.data && Array.isArray(response.data)) {
        const topicData = response.data;
        setLoadingFlashcards(false);
        router.push({
          pathname: "/(tabs)/TopicScreen",
          params: {
            userId,
            searchTopic,
            level,
            exploreFlashcards: JSON.stringify(topicData),
          },
        });
      }
      setLoadingFlashcards(false);
    } catch (error) {
      console.error("Error fetching topic details:", error);
    }
  };
  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Text style={styles.cardText}>{searchTopic}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface HistoryCardProps {
  searchTopic: string;
  id: string;
  level: string;
  userId: string;
  setHistoryTopics: React.Dispatch<React.SetStateAction<HistoryTopic[]>>;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  searchTopic,
  id,
  level,
  setHistoryTopics,
  userId,
}) => {
  const router = useRouter();
  const gradientColors = historyRandomGradient();
  const handleCardPress = async () => {
    try {
      const response = await API.get(`/api/expoloreflashcards/${id}`);
      if (response.data && Array.isArray(response.data)) {
        const topicData = response.data;
        router.push({
          pathname: "/(tabs)/TopicScreen",
          params: {
            userId,
            searchTopic,
            level,
            exploreFlashcards: JSON.stringify(topicData),
          },
        });
      }
    } catch (error) {
      console.error("Error fetching topic details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/topic/${id}`);
      setHistoryTopics((prevTopics) =>
        prevTopics.filter((topic) => topic.topiclevelId !== id)
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete history card.");
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.trashIcon} onPress={handleDelete}>
        <Icon name="trash-o" size={20} color="#102A43'" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        <LinearGradient colors={gradientColors} style={styles.gradienthistory}>
          <Text style={styles.cardText}>{searchTopic}</Text>
          <Text style={styles.ratingContainer}>
            <Icon name="bars" size={20} color="black" />
            <Text> </Text>
            <Text style={styles.ratingText}>10</Text>
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
  const [userId, setUserId] = useState<any>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [level, setLevel] = useState<string>();
  const [searchTopic, setSearchTopic] = useState<string>();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean>();
  interface HistoryTopic {
    topic: string;
    topiclevelId: string;
    level: string;
  }

  const [historyTopics, setHistoryTopics] = useState<HistoryTopic[]>([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopics = async () => {
      //setLoading(true);
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
          setUserId(id);
        } catch (decodeError) {
          Alert.alert("Error", "Failed to decode token");
          return;
        }
        const userData = await API.get(`/api/users/getme/${id}`);
        const majorName = userData.data.major;
        const userFlag = userData.data.flag;
        userFlag === 2 ? setIsPremium(true) : setIsPremium(false);

        const exploreHistory = await API.get(
          `/api/exploreflashcards/exploreHistory/${id}`
        );
  
        const exploreHistoryData = exploreHistory.data;
        if (
          exploreHistoryData.length > 0 &&
          Array.isArray(exploreHistoryData)
        ) {
          setHistoryTopics(exploreHistoryData);
        }
        console.log(exploreHistoryData);
        let generatedTopics = await API.get(
          `/api/exploreflashcards/generateTopics/${id}`
        );
        setSuggestedTopics(generatedTopics.data["Suggested Topics"]);
        setRelatedTopics(generatedTopics.data["Related Topics"]);
        setPopularTopics(generatedTopics.data["Popular Topics"]);
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

  if (loadingFlashcards) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CA7EC" />
        <Text style={styles.loadingText}>Generating Flashcards ...</Text>
      </View>
    );
  }

  const handleLevelSelect = (level: string) => {
    console.log(`Selected filter: ${level}`);
    setLevel(level);
    setShowDropdown(false);
  };

  const handleSearch = async () => {
    if (!searchTopic) {
      Alert.alert("Error", "Please enter a topic to search");
      return;
    }
    if (!level) {
      setLevel("Medium");
    }
    console.log("level from explore page: " + level);
    setLoadingFlashcards(true);
    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/exploreflashcards/searchTopic/${searchTopic}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level,
            userId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const exploreFlashcards = data;
        router.push({
          pathname: "/(tabs)/TopicScreen",
          params: {
            userId,
            searchTopic,
            level,
            exploreFlashcards: JSON.stringify(exploreFlashcards),
          },
        });
      } else {
        Alert.alert("No Results", "No flashcards found for this topic.");
      }
    } catch (error: any) {
      console.error("Error during search:", error.message || error);
      Alert.alert("Error", "Failed to search for topics. Please try again.");
    } finally {
      setLoadingFlashcards(false);
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.header}>Explore</Text>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchContainer}>

  <View style={styles.searchWrapper}>
    <TextInput
      placeholder="Enter a topic..."
      style={styles.input}
      value={searchTopic}
      onChangeText={(text) => setSearchTopic(text)}
      onSubmitEditing={handleSearch}
      returnKeyType="search"
      placeholderTextColor={"#52688F"}
    />

    <TouchableOpacity style={styles.filterIcon} onPress={() => setShowDropdown(!showDropdown)}>
      <Image source={require("../../assets/images/filter.png")} style={{ width: 20, height: 20 }} />
    </TouchableOpacity>
  </View>

  {showDropdown && (
    <View style={styles.dropdown}>
      <TouchableOpacity style={styles.dropdownItem} onPress={() => handleLevelSelect("Beginner")}>
        <Text style={styles.dropdownText}>Beginner</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownItem} onPress={() => handleLevelSelect("Medium")}>
        <Text style={styles.dropdownText}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownItem} onPress={() => handleLevelSelect("Advanced")}>
        <Text style={styles.dropdownText}>Advanced</Text>
      </TouchableOpacity>
    </View>
  )}

  <TouchableOpacity style={styles.generateButton} onPress={handleSearch}>
    <Text style={styles.generateButtonText}>Generate Flashcards</Text>
  </TouchableOpacity>
</View>

          {/*
          <View style={styles.searchBarContainer}>
            <LinearGradient
              style={styles.searchBar}
              colors={[
                "#1CA7EC",
                "#a8c3d4",
                "#dbd6df",
                "#eec6c7",
                "#db88a4",
                "#cc82b1",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <TextInput
                placeholder="Generate Flashcards for a new topic"
                style={{ ...styles.searchText, color: "black", zIndex: 55 }}
                value={searchTopic}
                onChangeText={(text) => setSearchTopic(text)}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                placeholderTextColor={"#1c3456"}
              />
            </LinearGradient>
            <TouchableOpacity
              style={styles.filterIcon}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Image
                source={require("../../assets/images/filter.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
            {showDropdown && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleLevelSelect("Beginner")}
                >
                  <Text style={styles.dropdownText}>Beginner</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleLevelSelect("Medium")}
                >
                  <Text style={styles.dropdownText}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleLevelSelect("Advanced")}
                >
                  <Text style={styles.dropdownText}>Advanced</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          */}
                              {/* History */}
                              <View style={styles.section}>
            <Text style={styles.sectionTitle}>History</Text>
            <FlatList
              horizontal
              data={historyTopics}
              renderItem={({ item }) => (
                <HistoryCard
                  searchTopic={item.topic}
                  id={item.topiclevelId}
                  userId={userId}
                  level={item.level}
                  setHistoryTopics={setHistoryTopics}
                />
              )}
              keyExtractor={(item) => item.topiclevelId}
            />
          </View>

          {/* Suggested Topics */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Icon name="lightbulb-o" size={27} color="#ffd335" />

              <Text style={styles.sectionTitle}>Suggested Topics</Text>
            </View>

            <FlatList
              data={suggestedTopics}
              renderItem={({ item }) => (
                <Card
                  searchTopic={item}
                  userId={userId}
                  setLoadingFlashcards={setLoadingFlashcards}
                />
              )}
              keyExtractor={(item, index) => `suggested-${index}`}
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatlistContainer}
            />
          </View>

          {/* Related Topics */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Icon name="link" size={27} color="#ffd335" />

              <Text style={styles.sectionTitle}>Related Topics</Text>
            </View>

            <FlatList
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatlistContainer}
              data={relatedTopics}
              renderItem={({ item }) => (
                <Card
                  searchTopic={item}
                  userId={userId}
                  setLoadingFlashcards={setLoadingFlashcards}
                />
              )}
              keyExtractor={(item, index) => `related-${index}`}
            />
          </View>

          {/* Popular Topics */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Icon name="fire" size={27} color="#ffd335" />

              <Text style={styles.sectionTitle}>Popular Topics</Text>
            </View>
            <FlatList
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatlistContainer}
              data={popularTopics}
              renderItem={({ item }) => (
                <Card
                  searchTopic={item}
                  userId={userId}
                  setLoadingFlashcards={setLoadingFlashcards}
                />
              )}
              keyExtractor={(item, index) => `popular-${index}`}
            />
          </View>

        </ScrollView>
        <NavBar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 50,
  },
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
    zIndex: 999,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 17,
    paddingTop: 10,
    overflow: "hidden",

    zIndex: 55,
  },
  dropdownText: {
    color: "#000",
    fontSize: 16,
    zIndex: 55,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
    position: "absolute",
    top: -50,
    left: 150,
    zIndex: 66,
    flex: 1,
  },
  searchBar: {
    borderRadius: 15,
    padding: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    color: "#000",
  },
  searchText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
    color :'#102A43'
  },
  card: {
    width: 250,
    height: 150,
    borderRadius: 35,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  gradienthistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: '#102A43',
    fontSize: 19,
    fontWeight: "bold",
    position: "absolute",
    top: 15,
    left: 10,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
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
    color: '#102A43',
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
    color: "#102A43",
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
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    color: "#000",
    zIndex: 55,
  },
  filterIcon: {
    marginLeft: 10,
  },

  scrollContainer: {
    paddingBottom: 100,
  },
  input: {
    borderWidth: 0.2,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f6f6f6",
    color: "#000",
    padding: 10,
    marginBottom: 10,
    width: "93%",
    alignSelf: "center",
  },searchContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
    
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },

  generateButton: {
    backgroundColor: "#6fc3ed",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 18,
    marginTop: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  
  generateButtonText: {
    color: "#102A43",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  
});

export default ExploreScreen;

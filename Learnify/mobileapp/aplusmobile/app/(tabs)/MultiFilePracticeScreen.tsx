import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import API from "../../api/axois";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Back from "./Back";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";

interface Course {
  id: string;
  name: string;
}

interface File {
  id: string;
  name: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const MultiFilePracticeScreen: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCourseModalVisible, setCourseModalVisible] =
    useState<boolean>(false);
  const [isFileModalVisible, setFileModalVisible] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finish, setFinish] = useState(false);
  const flipAnim = useState(new Animated.Value(0))[0];

  const gradients: [string, string][] = [
    ["#f9f9f9", "#e8f0ff"],
    ["#fff4e6", "#ffe9f0"],
    ["#f0f9ff", "#e8f0e6"],
    ["#e9f7ff", "#fff7e6"],
    ["#f9efff", "#f9fff9"],
  ];
  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    try {
      await API.post(
        `/api/file/practice/review/${flashcards[currentIndex].id}`,
        { rating }
      );
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Error", "Failed to submit rating");
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedRating(null);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinish(true);
    }
  };

  const getRandomGradient = (): [string, string] =>
    gradients[Math.floor(Math.random() * gradients.length)];

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const userId = 1; // Replace with dynamic user ID
        const response = await API.get(`/api/user/courses/${userId}`);
        if (response.status === 200) {
          const formattedCourses: Course[] = response.data.map(
            (course: any) => ({
              id: course.courseId,
              name: course.courseName,
            })
          );
          setCourses(formattedCourses);
        } else {
          Alert.alert("Error", "Failed to fetch courses.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelection = async (course: Course) => {
    setLoading(true);
    try {
      const response = await API.get(`/api/user/course/files/${course.id}`);
      if (response.status === 200) {
        const formattedFiles: File[] = response.data.map((file: any) => ({
          id: file.fileId,
          name: file.fileName,
        }));
        setFiles(formattedFiles);
        setSelectedFiles(formattedFiles.map((file) => file.id)); // Pre-select all files
      } else {
        Alert.alert("Error", "Failed to fetch files for the selected course.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching files.");
    } finally {
      setLoading(false);
      setFileModalVisible(true);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const fetchFlashcards = async () => {
    try {
      if (selectedFiles.length === 0) {
        Alert.alert(
          "No Files Selected",
          "Please select at least one file to fetch flashcards."
        );
        return;
      }
      setLoading(true);
      const allFlashcards: Flashcard[] = [];

      for (const fileId of selectedFiles) {
        try {
          const response = await API.post(`/api/file/practice/${fileId}`);
          console.log(`API Response for File ${fileId}:`, response.data);

          if (Array.isArray(response.data) && response.data.length > 0) {
            const fetchedFlashcards = response.data.map((flashcard) => ({
              id: flashcard.flashcardId,
              question: flashcard.flashcardQ || "No question available",
              answer: flashcard.flashcardA || "No answer available",
            }));
            allFlashcards.push(...fetchedFlashcards);
          }
        } catch (fileError) {
          console.error(
            `Error fetching flashcards for File ID ${fileId}:`,
            fileError
          );
          Alert.alert(
            "Error",
            `Failed to fetch flashcards for File ID ${fileId}.`
          );
        }
      }

      if (allFlashcards.length > 0) {
        setFlashcards(allFlashcards);
      } else {
        Alert.alert(
          "No Flashcards",
          "No flashcards were fetched for the selected files."
        );
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      Alert.alert("Error", "Failed to fetch flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => {
        setCourseModalVisible(false);
        handleCourseSelection(item);
      }}
    >
      <Text style={styles.courseText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFileItem = ({ item }: { item: File }) => (
    <TouchableOpacity
      style={[
        styles.fileItem,
        selectedFiles.includes(item.id) && styles.fileItemSelected,
      ]}
      onPress={() => toggleFileSelection(item.id)}
    >
      <Text style={styles.fileText}>{item.name}</Text>
      {selectedFiles.includes(item.id) && (
        <Icon name="checkmark-circle" size={20} color="green" />
      )}
    </TouchableOpacity>
  );

  if (finish) {
    return (
      <LinearGradient
        colors={["#e8dcf4", "#dbd1e9", "#989eeb", "#989bbe"]}
        style={styles.container}
      >
        <View style={styles.celebrationContainer}>
          <LottieView
            source={require("../../../aplusmobile/assets/prize.json")} // Place your Lottie file in the project directory
            autoPlay
            loop={true}
            style={styles.lottie}
          />
          <Animatable.Text
            animation="bounceIn"
            duration={1500}
            style={styles.congratsText}
          >
            Congratulations! 🎉 You've completed all flashcards!
          </Animatable.Text>
        </View>
      </LinearGradient>
    );
  }
  return (
    <View style={styles.container}>
      {flashcards.length === 0 && (
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => setCourseModalVisible(true)}
        >
          <Text style={styles.practiceButtonText}>Practice Now</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {isCourseModalVisible && (
        <Modal transparent visible={isCourseModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Course</Text>
              <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={renderCourseItem}
              />
            </View>
          </View>
        </Modal>
      )}

      {isFileModalVisible && (
        <Modal transparent visible={isFileModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Files</Text>
              <FlatList
                data={files}
                keyExtractor={(item) => item.id}
                renderItem={renderFileItem}
                style={styles.fileList}
              />
              <TouchableOpacity
                style={styles.fetchButton}
                onPress={() => {
                  fetchFlashcards(), setFileModalVisible(false);
                }}
              >
                <Text style={styles.fetchButtonText}>start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {flashcards.length > 0 && (
        <View style={styles.container}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {flashcards.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  {
                    width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
          {/* Flashcard */}
          <TouchableOpacity onPress={handleFlip}>
            <LinearGradient
              colors={getRandomGradient()}
              style={styles.flashcard}
            >
              {!isFlipped ? (
                <Animated.View
                  style={[
                    styles.cardContent,
                    { transform: [{ rotateY: frontInterpolate }] },
                  ]}
                >
                  <Text style={styles.cardText}>
                    {flashcards[currentIndex].question}
                  </Text>
                </Animated.View>
              ) : (
                <Animated.View
                  style={[
                    styles.cardContent,
                    { transform: [{ rotateY: backInterpolate }] },
                  ]}
                >
                  <Text style={styles.cardText}>
                    {flashcards[currentIndex].answer}
                  </Text>
                </Animated.View>
              )}
            </LinearGradient>
          </TouchableOpacity>
          {/* Rating */}
          <View style={styles.ratingContainer}>
            {[
              { emoji: "😡", label: "Very Hard" },
              { emoji: "😞", label: "Hard" },
              { emoji: "😐", label: "Okay" },
              { emoji: "🙂", label: "Easy" },
              { emoji: "😀", label: "Very Easy" },
            ].map((rating, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.ratingButton,
                  selectedRating === index + 1 && styles.selectedRating,
                ]}
                onPress={() => handleRating(index + 1)}
              >
                <Text style={styles.emoji}>{rating.emoji}</Text>
                <Text style={styles.label}>{rating.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Ionicons name="arrow-forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#007bff",
  },
  progressText: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  flashcard: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
  },
  nextButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  finishButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  finishButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ratingContent: {
    flexDirection: "row", // Arrange emoji and label horizontally
    alignItems: "center", // Ensure emoji and text are vertically aligned
  },
  ratingContainer: {
    flexDirection: "column", // Stack buttons vertically
    justifyContent: "center", // Center-align the stack
    alignItems: "center", // Center-align the buttons horizontally
    marginVertical: 20,
  },
  ratingButton: {
    flexDirection: "row", // Keep emoji and label side-by-side
    alignItems: "center", // Vertically align emoji and label
    justifyContent: "center", // Center-align content
    padding: 10,
    marginVertical: 5, // Add spacing between buttons
    width: "80%", // Make buttons take up 80% of the container width
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  selectedRating: {
    backgroundColor: "#007bff", // Highlight selected button
  },
  emoji: {
    fontSize: 20, // Adjust size for emoji
    marginRight: 10, // Space between emoji and label
  },
  label: {
    fontSize: 16, // Normal font size for label
  },
  celebrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 60,
  },
  lottie: {
    width: 200,
    height: 200,
    flex: 1,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#21277b",
    textAlign: "center",

    paddingTop: -10,
    marginBottom: 20,
  },
  practiceButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  practiceButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  courseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  courseText: {
    fontSize: 16,
    color: "#333",
  },
  fileList: {
    maxHeight: 200,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  fileItemSelected: {
    backgroundColor: "#e0f7fa",
  },
  fileText: {
    fontSize: 16,
    color: "#333",
  },
  fetchButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  fetchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flashcardContainer: {
    marginTop: 20,
  },
});

export default MultiFilePracticeScreen;

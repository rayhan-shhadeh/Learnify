import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import API from "../../../api/axois";
import Icon from "react-native-vector-icons/FontAwesome";
interface PdfViewerProps {
  fileId: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileId }) => {
  const { passedFileId } = useLocalSearchParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<{
    term: string;
    definition: string;
  } | null>(null);
  const [activeModal, setActiveModal] = useState<
    "PDF" | "Flashcards" | "KeyTerms"
  >("PDF");
  const flashcards = [
    { id: "1", question: "question 1", answer: "answer 1" },
    { id: "2", question: "question 2", answer: "answer 2" },
    { id: "3", question: "question 3", answer: "answer 3" },
  ];
  const [keyTerms, setKeyTerms] = useState([
    {
      term: "React",
      definition: "A JavaScript library for building user interfaces.",
    },
    {
      term: "JavaScript",
      definition: "A programming language used to make web pages interactive.",
    },
    {
      term: "API",
      definition:
        "An interface that allows communication between two systems or components.",
    },
    {
      term: "Node.js",
      definition:
        "A JavaScript runtime environment for executing code outside of a browser.",
    },
  ]);
  useEffect(() => {
    const fetchPdfUrl = async () => {
      fileId = passedFileId.toString();
      try {
        setLoading(true);
        const response = await API.get(`/api/file/${fileId}`);
        setPdfUrl(response.data.fileURL);
      } catch (err) {
        console.error("Error fetching PDF URL:", err);
        setError("Failed to load the PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPdfUrl();
  }, [fileId]);
  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredKeyTerms = keyTerms.filter((keyTerm) =>
    keyTerm.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTerm = (term: { term: string; definition: string }) => {
    setSelectedTerm(term);
  };

  const handleGenerate = () => {
    alert("Generate functionality is not implemented yet!");
  };

  const handleManual = () => {
    alert("Manual functionality is not implemented yet!");
  };

  const renderContent = () => {
    if (activeModal === "PDF") {
      if (loading) {
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading PDF...</Text>
          </View>
        );
      }
      if (error) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        );
      }
      return pdfUrl ? (
        <WebView source={{ uri: pdfUrl }} style={styles.webview} />
      ) : null;
    }
    if (activeModal === "Flashcards") {
      return (
        <View style={styles.modalContainer}>
          <View style={styles.flashcardsContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.flag}>
                <Image
                  source={require("../../../assets/images/flash-cards.png")}
                  style={styles.flagImage}
                />
              </View>

              <Text style={styles.headerTitle}>Review</Text>
              <Text> </Text>
            </View>
            <View style={styles.flashcardsButtonContainer}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fbfbfb",
                  padding: 10,
                  borderRadius: 20,
                  margin: 10,
                }}
              >
                <Text>Generate </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fdfdfd",
                  padding: 10,
                  borderRadius: 20,
                  margin: 10,
                }}
              >
                <Text>Manual </Text>
              </TouchableOpacity>
            </View>
            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              placeholder="Search Flashcards..."
              value={searchTerm}
              onChangeText={handleSearch}
            />

            {/* Flashcard */}
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={handlePreviousCard}
              >
                <Text style={styles.arrow}>{"<"}</Text>
              </TouchableOpacity>
              <View style={styles.card}>
                <View style={styles.icon}>
                  <TouchableOpacity style={{ marginRight: 10 }}>
                    <Icon name="edit" size={21} color="#000" />
                  </TouchableOpacity>{" "}
                  <TouchableOpacity style={{ marginRight: 10 }}>
                    <Icon name="trash" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardText}>
                  {flashcards[currentCardIndex].question}
                </Text>
                <Text style={styles.cardAnswer}>
                  {flashcards[currentCardIndex].answer}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={handleNextCard}
              >
                <Text style={styles.arrow}>{">"}</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              {flashcards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentCardIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      );
    }
    if (activeModal === "KeyTerms") {
      return (
        <View style={styles.keyTermContainer}>
          {/* Search Bar */}
          <TextInput
            style={styles.keyTermSearchBar}
            placeholder="Search Key Terms..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {/* Buttons */}
          <View style={styles.keyTermbuttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleGenerate}>
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleManual}>
              <Text style={styles.buttonText}>Manual</Text>
            </TouchableOpacity>
          </View>

          {/* Key Terms */}
          <ScrollView style={styles.keyTermsContainer}>
            {filteredKeyTerms.map((keyTerm, index) => (
              <TouchableOpacity
                key={index}
                style={styles.keyTermCard}
                onPress={() => handleSelectTerm(keyTerm)}
              >
                <Text style={styles.keyTermText}>{keyTerm.term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Selected Definition */}
          {selectedTerm && (
            <View style={styles.definitionContainer}>
              <Text style={styles.definitionTitle}>Definition</Text>
              <Text style={styles.definitionText}>
                {selectedTerm.definition}
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeModal === "PDF" && styles.activeButton]}
          onPress={() => setActiveModal("PDF")}
        >
          <Text style={styles.buttonText}>PDF View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeModal === "Flashcards" && styles.activeButton,
          ]}
          onPress={() => setActiveModal("Flashcards")}
        >
          <Text style={styles.buttonText}>Flashcards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeModal === "KeyTerms" && styles.activeButton,
          ]}
          onPress={() => setActiveModal("KeyTerms")}
        >
          <Text style={styles.buttonText}>Key Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  flashcardsButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  button: {
    padding: 10,
    backgroundColor: "#1f93e0",
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(169, 220, 254)",
  },
  flashcardsContainer: {
    flex: 1,
    backgroundColor: "rgb(43, 157, 233)",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  flag: {
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  flagText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 10,
  },
  settingsText: {
    fontSize: 18,
    color: "#FFF",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  arrowContainer: {
    padding: 20,
  },
  arrow: {
    fontSize: 24,
    color: "#FFF",
  },
  card: {
    flex: 1,
    height: 200,
    backgroundColor: "#FFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    paddingBottom: 10,
  },
  cardAnswer: {
    fontSize: 18,
    color: "#000",
  },
  progressContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    backgroundColor: "#CCC",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#FFD700",
  },
  flagImage: {
    width: 30,
    height: 30,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    right: 10,
    top: 10,
  },
  searchBar: {
    height: 40,
    width: 300,
    marginVertical: 10,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#333",
    marginBottom: 30,
  },
  keyTermContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  keyTermSearchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  keyTermbuttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  keyTermbutton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#1f93e0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  keyTermbuttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  keyTermsContainer: {
    flex: 1,
    marginBottom: 10,
  },
  keyTermCard: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyTermText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  definitionContainer: {
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 90,
    height: 200,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1E90FF",
  },
  definitionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default PdfViewer;

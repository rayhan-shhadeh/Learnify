import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import { WebView } from "react-native-webview";
import API, { LOCALHOST } from "../../../api/axois";
import Icon from "react-native-vector-icons/AntDesign";
import FlashcardIcon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface PdfViewerProps {
  fileId: string;
}
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  page: string;
  type: number;
}
interface KeyTerm {
  id: string;
  term: string;
  definition: string;
  page: string;
  type: number;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileId }) => {
  const router = useRouter();
  const { passedFileId, activeTab } = useLocalSearchParams();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcardModalVisible, setFlashcardModalVisible] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");
  const [length, setLength] = useState("Short");
  const [showKeytermDifficultyOptions, setShowKeytermDifficultyOptions] =
    useState(false);
  const [showKeytermLengthOptions, setShowKeytermLengthOptions] =
    useState(false);
  const [keytermModalVisible, setKeytermModalVisible] = useState(false);
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
  const [showLengthOptions, setShowLengthOptions] = useState(false);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedFlashcards, setFetchedFlashcards] = useState<Flashcard[]>([]);
  const [fetchedKeyTerms, setFetchedKeyTerms] = useState<KeyTerm[]>([]);
  const activeTabString: string = activeTab?.toString();
  const [activeModal, setActiveModal] = useState<string>(
    activeTabString || "PDF"
  ); //"PDF" | "Flashcards" | "KeyTerms"
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [keyTerms, setKeyTerms] = useState<KeyTerm[]>([]);
  const [flashcardStates, setFlashcardStates] = useState<
    Record<
      string,
      { isEditing: boolean; editedQuestion: string; editedAnswer: string }
    >
  >({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentKeyterm, setCurrentKeyterm] = useState<KeyTerm | null>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [isAllPages, setIsAllPages] = useState<boolean>(true);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>();
  const [userId, setUserId] = useState<string>();
  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token not found");
        router.push("/(tabs)/auth/signin");
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      console.log(decoded?.id);
      setUserId(decoded?.id);
      //preimium flag
      const userData = await API.get(`/api/users/getme/${decoded?.id}`);
      const userFlag = userData.data.data.flag;
      userFlag === 1 ? setIsPremium(true) : setIsPremium(false);
    };

    const fetchPdfUrl = async () => {
      fileId = passedFileId.toString();
      try {
        setLoading(true);
        const response = await API.get(`/api/file/${fileId}`);
        setPdfUrl(response.data.fileURL);
        setNumberOfPages(response.data.numberOfPages);
        setStartPage(1);
        setEndPage(numberOfPages);
      } catch (err) {
        console.error("Error fetching PDF URL:", err);
        setError("Failed to load the PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    const fetchFlashcards = async () => {
      try {
        // const response = await API.get(`/api/file/${fileId}`);
        const response = await API.get(`/api/file/flashcards/${fileId}`);
        const data = response.data.map((flashcard: any) => ({
          id: flashcard.flashcardId,
          question: flashcard.flashcardQ || "",
          answer: flashcard.flashcardA || "",
          type: flashcard.type,
          page: flashcard.page,
        }));
        // Initialize editing states for all flashcards
        const initialStates = data.reduce((acc: any, flashcard: Flashcard) => {
          acc[flashcard.id] = {
            isEditing: false,
            editedQuestion: flashcard.question,
            editedAnswer: flashcard.answer,
          };
          return acc;
        }, {});
        setFlashcardStates(initialStates);
        setFlashcards(data);
        setFetchedFlashcards(data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    const fetchKeyterms = async () => {
      try {
        const response = await API.get(`/api/file/keyterms/${fileId}`);
        const data = response.data.map((keyterm: any) => ({
          id: keyterm.keytermId,
          term: keyterm.keytermText,
          definition: keyterm.keytermDef || "",
          type: keyterm.type,
          page: keyterm.page,
        }));
        setKeyTerms(data);
        setFetchedKeyTerms(data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    initialize();
    fetchPdfUrl();
    fetchFlashcards();
    fetchKeyterms();
  }, [fileId]);

  const toggleDefinition = (id: number) => {
    setActiveKey((prev) => (prev === id ? null : id));
  };

  const fetchFlashcards = async () => {
    try {
      const response = await API.get(`/api/file/flashcards/${passedFileId}`);
      const data = response.data.map((flashcard: any) => ({
        id: flashcard.flashcardId,
        question: flashcard.flashcardQ || "",
        answer: flashcard.flashcardA || "",
        type: flashcard.type,
        page: flashcard.page,
      }));
      // Initialize editing states for all flashcards
      const initialStates = data.reduce((acc: any, flashcard: Flashcard) => {
        acc[flashcard.id] = {
          isEditing: false,
          editedQuestion: flashcard.question,
          editedAnswer: flashcard.answer,
        };
        return acc;
      }, {});
      setFlashcardStates(initialStates);
      setFlashcards(data);
      setFetchedFlashcards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleEditToggle = (id: string) => {
    setFlashcardStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isEditing: !prev[id].isEditing,
      },
    }));
  };

  const handleSaveFlashcard = async (id: string) => {
    try {
      const { editedQuestion, editedAnswer } = flashcardStates[id];
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/flashcard/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flashcardQ: editedQuestion,
            flashcardA: editedAnswer,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to update flashcard. Status: ${response.status}`
        );
      }
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((flashcard) =>
          flashcard.id === id
            ? { ...flashcard, question: editedQuestion, answer: editedAnswer }
            : flashcard
        )
      );
      setFlashcardStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditing: false },
      }));
      console.log(`Flashcard with ID ${id} successfully updated.`);
    } catch (error) {
      console.error("Error saving flashcard:", error);
    }
  };

  const handleEditKeyterm = (keyterm: KeyTerm) => {
    setCurrentKeyterm(keyterm);
    setIsModalVisible(true);
  };

  const handleSaveKeyterm = async () => {
    if (!currentKeyterm) return;

    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/keyterm/${currentKeyterm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keytermText: currentKeyterm.term,
            keytermDef: currentKeyterm.definition,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update keyterm. Status: ${response.status}`);
      }
      setKeyTerms((prevKeyTerms) =>
        prevKeyTerms.map((keyterm) =>
          keyterm.id === currentKeyterm.id
            ? {
                ...keyterm,
                term: currentKeyterm.term,
                definition: currentKeyterm.definition,
              }
            : keyterm
        )
      );
      setIsModalVisible(false);
      setCurrentKeyterm(null);
      console.log(`Keyterm with ID ${currentKeyterm.id} successfully updated.`);
    } catch (error) {
      console.error("Error saving keyterm:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
    setCurrentKeyterm(null);
  };

  /*
  const renderFlashcard = ({
    item,
  }: {
    item: { id: string; question: string; answer: string ; type:string };
  }) => (
    <View style={styles.flashcardCard}>
      <View style={styles.flashcardContent}>
        <Text style={styles.flashcardTitle}>{item.question}</Text>
        <Text style={styles.flashcardDescription}>{item.answer}</Text>
      </View>
      <View style={styles.flashcardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FlashcardIcon name="create-outline" size={20} color="#6b2905" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.actionButton}>
            <Icon
              name="checkmark-done-circle-outline"
              size={20}
              color="#11ad0c"
            />
            <Text style={styles.actionText}>Add</Text>
          </TouchableOpacity> */
  /*
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteFlashcard(item.id)} // Pass the specific flashcard ID
          >
            <FlashcardIcon name="trash-outline" size={20} color="#F44336" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
*/

  const renderFlashcard = ({ item }: { item: Flashcard }) => {
    const { isEditing, editedQuestion, editedAnswer } = flashcardStates[
      item.id
    ] || {
      isEditing: false,
      editedQuestion: item.question,
      editedAnswer: item.answer,
    };
    return (
      <View style={styles.flashcardCard}>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.flashcardInput}
              value={editedQuestion}
              onChangeText={(text) =>
                setFlashcardStates((prev) => ({
                  ...prev,
                  [item.id]: { ...prev[item.id], editedQuestion: text },
                }))
              }
              placeholder="Edit Question"
              multiline={true}
            />
            <TextInput
              style={styles.flashcardInput}
              value={editedAnswer}
              onChangeText={(text) =>
                setFlashcardStates((prev) => ({
                  ...prev,
                  [item.id]: { ...prev[item.id], editedAnswer: text },
                }))
              }
              placeholder="Edit Answer"
              multiline={true}
            />
            <View style={styles.flashcardActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSaveFlashcard(item.id)}
              >
                <Text style={styles.actionTextSave}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setFlashcardStates((prev) => ({
                    ...prev,
                    [item.id]: {
                      ...prev[item.id],
                      isEditing: false,
                      editedQuestion: item.question,
                      editedAnswer: item.answer,
                    },
                  }))
                }
              >
                <Text style={styles.actionTextCancle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.flashcardContent}>
              <Text style={styles.flashcardTitle}>💬 {item.question}</Text>
              <Text style={styles.flashcardDescription}>💡 {item.answer}</Text>
            </View>
            <View style={styles.flashcardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditToggle(item.id)}
              >
                <FlashcardIcon name="create-outline" size={20} color="green" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              {item.type === 1 && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleGoToPage(item.question, item.answer, item.page, "F")
                  }
                >
                  <LottieView
                    source={require("../../../assets/eye.json")}
                    autoPlay
                    loop
                    style={{ width: 35, height: 35 }}
                  />

                  <Text>{item.page}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteFlashcard(item.id)}
              >
                <FlashcardIcon name="trash-outline" size={20} color="#F44336" />
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    try {
      await API.delete(`/api/flashcard/${flashcardId}`);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.filter((flashcard) => flashcard.id !== flashcardId)
      );
      setFetchedFlashcards(flashcards);
      console.log(`Flashcard with ID ${flashcardId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting flashcard with ID ${flashcardId}:, error`);
    }
  };

  const handleDeleteKeyTerm = async (keyTermId: string) => {
    try {
      await API.delete(`/api/keyterm/${keyTermId}`);
      setKeyTerms((prevKeyTerms) =>
        prevKeyTerms?.filter((keyTerm) => keyTerm.id !== keyTermId)
      );
      setFetchedKeyTerms(keyTerms);
      console.log(`Key term with ID ${keyTermId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting key term with ID ${keyTermId}:, error`);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!passedFileId) {
      alert("Try again!");
      return;
    }
    if (endPage < startPage) {
      alert("Invalid start and end!");
      return;
    }
    console.log("Generating flashcards....");
    setLoading(true);
    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/smartFlashcards/${passedFileId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complexity: difficulty,
            length: length,
            allPages: isAllPages,
            startPage: startPage,
            endPage: endPage,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data || data.length === 0) {
        setFlashcards([]);
        setLoading(false);
        setLoading(false);
        return;
      }
      console.log("Flashcards Generated Successfully.");
      fetchFlashcards();
      setLoading(false);
      setDifficulty("Easy");
      setLength("Short ");
      setIsAllPages(true);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError("hi");
      setLoading(true);
    }
  };

  const handleGenerateKeyTerms = async () => {
    console.log("Generating key terms...");
    if (!passedFileId) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/smartKeyterms/${passedFileId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complexity: difficulty,
            length: length,
            allPages: isAllPages,
            startPage: startPage,
            endPage: endPage,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse JSON response
      if (!data || data.length === 0) {
        setKeyTerms([]); // Clear key terms if no data is returned
        setLoading(false);
        return;
      }
      const fetchedKeyTerms = data.map((keyTerm: any) => ({
        id: keyTerm.keytermId,
        term: keyTerm.keytermText || "",
        definition: keyTerm.keytermDef || "",
        type: 1,
        page: keyTerm.page,
      }));
      setKeyTerms(fetchedKeyTerms); // Update the key terms state
      console.log("hi after key terms");
      setLoading(false);
      setKeytermModalVisible(false);
      setDifficulty("Easy");
      setLength("Short ");
      setIsAllPages(true);
    } catch (error) {
      console.error("Error generating key terms:", error);
      setError("Failed to generate key terms. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CA7EC" />
        <Text style={styles.loadingText}>Generating...</Text>
      </View>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (activeModal === "Flashcards") {
      setFlashcards(
        query
          ? fetchedFlashcards.filter(
              (flashcard) =>
                flashcard.question
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                flashcard.answer.toLowerCase().includes(query.toLowerCase())
            )
          : fetchedFlashcards
      );
    } else if (activeModal === "KeyTerms") {
      setKeyTerms(
        query
          ? fetchedKeyTerms.filter(
              (keyTerm) =>
                keyTerm.term.toLowerCase().includes(query.toLowerCase()) ||
                keyTerm.definition.toLowerCase().includes(query.toLowerCase())
            )
          : fetchedKeyTerms
      );
    }
  };

  const handleFlashcardGenerateClick = async () => {
    if (!isPremium) {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/payment/reachLimit/${userId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to check limit: ${response.statusText}`);
      }
      const data = await response.json();
      if (data === true) {
        // If the user has reached the limit, redirect to the Premium screen
        router.push("/(tabs)/Payment/PremiumScreen");
      } else {
        setFlashcardModalVisible(true);
      }
    } else {
      setFlashcardModalVisible(true);
    }
  };

  const handleKeytermGenerateClick = async () => {
    if (!isPremium) {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/payment/reachLimit/${userId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to check limit: ${response.statusText}`);
      }
      const data = await response.json();
      if (data === true) {
        // If the user has reached the limit, redirect to the Premium screen
        router.push("/(tabs)/Payment/PremiumScreen");
      } else {
        setFlashcardModalVisible(true);
      }
    } else {
      setKeytermModalVisible(true);
    }
  };

  const handleGoToPage = (
    questionORterm: string,
    answerORdefinition: string,
    page: string,
    KF: string
  ) => {
    router.push({
      pathname: "/(tabs)/Files/viewPageScreen",
      params: {
        questionORterm,
        answerORdefinition,
        pdfUrl,
        page,
        passedFileId,
        KF,
      },
    });
  };

  const handleEndPageInput = (text: string) => {
    const end = Number(text);
    if (end > numberOfPages) {
      alert(`End page cannot exceed ${numberOfPages}`);
      setEndPage(numberOfPages);
    } else if (end < 1) {
      alert(`End page must be at least 1`);
      setEndPage(numberOfPages);
    } else {
      setEndPage(end);
    }
  };

  const handleStartPage = (text: string) => {
    const start = Number(text);
    if (start < 1) {
      alert("Start Page must be at least 1.");
      setStartPage(1);
    } else if (start > numberOfPages) {
      alert("Invalid");
      setStartPage(1);
    } else {
      setStartPage(start);
      console.log(`Start Page is valid: ${startPage}`);
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
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
        <WebView source={{ uri: `${pdfUrl}` }} style={styles.webview} />
      ) : null;
    }
    if (activeModal === "Flashcards") {
      return (
        // <View style={styles.modalContainer}>
        //   <View style={styles.flashcardsContainer}>
        //     {/* Header */}
        //     <View style={styles.header}>
        //       <View style={styles.flag}>
        //         <Image
        //           source={require("../../../assets/images/flash-cards.png")}
        //           style={styles.flagImage}
        //         />
        //       </View>

        //       <Text style={styles.headerTitle}>Review</Text>
        //       <Text> </Text>
        //     </View>
        //     <View style={styles.flashcardsButtonContainer}>
        //       <TouchableOpacity
        //         style={{
        //           backgroundColor: "#fbfbfb",
        //           padding: 10,
        //           borderRadius: 20,
        //           margin: 10,
        //         }}
        //       >
        //         <Text>Generate </Text>
        //       </TouchableOpacity>
        //       <TouchableOpacity
        //         style={{
        //           backgroundColor: "#fdfdfd",
        //           padding: 10,
        //           borderRadius: 20,
        //           margin: 10,
        //         }}
        //       >
        //         <Text>Manual </Text>
        //       </TouchableOpacity>
        //     </View>
        //     {/* Search Bar */}
        //     <TextInput
        //       style={styles.searchBar}
        //       placeholder="Search Flashcards..."
        //       value={searchTerm}
        //       onChangeText={handleSearch}
        //     />

        //     {/* Flashcard */}
        //     <View style={styles.cardContainer}>
        //       <TouchableOpacity
        //         style={styles.arrowContainer}
        //         onPress={handlePreviousCard}
        //       >
        //         <Text style={styles.arrow}>{"<"}</Text>
        //       </TouchableOpacity>
        //       <View style={styles.card}>
        //         <View style={styles.icon}>
        //           <TouchableOpacity style={{ marginRight: 10 }}>
        //             <Icon name="edit" size={21} color="#000" />
        //           </TouchableOpacity>{" "}
        //           <TouchableOpacity style={{ marginRight: 10 }}>
        //             <Icon name="trash" size={20} color="#000" />
        //           </TouchableOpacity>
        //         </View>
        //         <Text style={styles.cardText}>
        //           {flashcards[currentCardIndex].question}
        //         </Text>
        //         <Text style={styles.cardAnswer}>
        //           {flashcards[currentCardIndex].answer}
        //         </Text>
        //       </View>
        //       <TouchableOpacity
        //         style={styles.arrowContainer}
        //         onPress={handleNextCard}
        //       >
        //         <Text style={styles.arrow}>{">"}</Text>
        //       </TouchableOpacity>
        //     </View>

        //     {/* Progress Bar */}
        //     <View style={styles.progressContainer}>
        //       {flashcards.map((_, index) => (
        //         <View
        //           key={index}
        //           style={[
        //             styles.progressDot,
        //             index === currentCardIndex && styles.activeDot,
        //           ]}
        //         />
        //       ))}
        //     </View>
        //   </View>
        // </View>

        <View style={styles.flashcardContainer}>
          {/* Search Bar */}
          <TextInput
            style={styles.keyTermSearchBar}
            placeholder="Search Flashcards..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View style={styles.flashcardsButtonContainer}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleFlashcardGenerateClick} // Correctly triggers modal visibility
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.popupbuttonText}>Generate Flashcards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => {
                router.replace({
                  pathname: `/Flashcards/ManualFlashcard`,
                  params: { passedFileId },
                });
              }}
            >
              <Ionicons name="pencil" size={22} color="#fff" />
              <Text style={styles.popupbuttonText}>Manual</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id}
            renderItem={renderFlashcard}
            contentContainerStyle={styles.list}
          />
          {/* <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateClick} // Correctly triggers modal visibility
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.popupbuttonText}>Generate Flashcards</Text>
          </TouchableOpacity> */}
          {/* Modal for Flashcard Options */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={flashcardModalVisible}
            onRequestClose={() => setFlashcardModalVisible(false)}
          >
            <View style={styles.popupmodalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="setting" size={24} color="#333" />
                  <Text style={styles.modalTitle}>Flashcard Settings</Text>
                </View>
                {/* Flashcard Range Selector */}
                <View style={styles.option}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        isAllPages && styles.checkedCheckbox,
                      ]}
                      onPress={() => setIsAllPages(!isAllPages)}
                    >
                      <Text style={{ fontSize: 20 }}>
                        {isAllPages ? "✅" : "⬜"}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.optionLabel}>All Pages</Text>
                  </View>
                  {!isAllPages && (
                    <View style={styles.pageRangeContainer}>
                      <View style={styles.pageInputContainer}>
                        <Text style={styles.optionLabel}>Start Page:</Text>
                        <TextInput
                          style={styles.pageInput}
                          keyboardType="numeric"
                          placeholder="Enter start page"
                          placeholderTextColor="#A9A9A9"
                          onChangeText={handleStartPage}
                          onBlur={handleDismissKeyboard}
                          returnKeyType="done"
                          onSubmitEditing={handleDismissKeyboard}
                        />
                      </View>
                      <View style={styles.pageInputContainer}>
                        <Text style={styles.optionLabel}>End Page:</Text>
                        <TextInput
                          style={styles.pageInput}
                          keyboardType="numeric"
                          placeholder={`Enter end page (Max: ${numberOfPages})`}
                          placeholderTextColor="#A9A9A9"
                          onChangeText={handleEndPageInput}
                          onBlur={handleDismissKeyboard}
                          returnKeyType="done"
                          onSubmitEditing={handleDismissKeyboard}
                        />
                      </View>
                    </View>
                  )}
                </View>
                {/* Length Selector */}
                <View style={styles.option}>
                  <Text style={styles.optionLabel}>Length:</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowLengthOptions(!showLengthOptions)}
                  >
                    <Text style={styles.dropdownText}>
                      {length || "Select"}
                    </Text>
                  </TouchableOpacity>
                  {showLengthOptions && (
                    <View style={styles.dropdownOptions}>
                      {["Short", "Medium", "Long"].map((lengthOption) => (
                        <TouchableOpacity
                          key={lengthOption}
                          style={styles.dropdownOption}
                          onPress={() => {
                            setLength(lengthOption);
                            setShowLengthOptions(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>
                            {lengthOption}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                {/* Difficulty Selector */}
                <View style={styles.option}>
                  <Text style={styles.optionLabel}>Difficulty:</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() =>
                      setShowDifficultyOptions(!showDifficultyOptions)
                    }
                  >
                    <Text style={styles.dropdownText}>
                      {difficulty || "Select"}
                    </Text>
                  </TouchableOpacity>
                  {showDifficultyOptions && (
                    <View style={styles.dropdownOptions}>
                      {["Easy", "Intermediate", "Advanced"].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={styles.dropdownOption}
                          onPress={() => {
                            setDifficulty(level);
                            setShowDifficultyOptions(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{level}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                {/* Actions */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => setFlashcardModalVisible(false)}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.popupbuttonText}>
                    <Button
                      title="Generate"
                      onPress={() => {
                        handleGenerateFlashcards();
                        setFlashcardModalVisible(false);
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
          <View style={styles.flashcardsButtonContainer}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleKeytermGenerateClick}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.popupbuttonText}>Generate Key Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => {
                router.replace({
                  //pathname: /Flashcards/ManualFlashcard,
                  pathname: `/KeyTerms/ManualKeyTerm`,
                  params: { passedFileId },
                });
              }}
            >
              <Ionicons name="pencil" size={22} color="#fff" />

              <Text style={styles.popupbuttonText}>Manual</Text>
            </TouchableOpacity>
          </View>
          {/* Modal for key terms Options */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={keytermModalVisible}
            onRequestClose={() => setKeytermModalVisible(false)} // Closes the modal when requested
          >
            <View style={styles.popupmodalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="setting" size={24} color="#333" />
                  <Text style={styles.modalTitle}>Keyterm Settings</Text>
                </View>
                {/* Flashcard Count Selector */}
                <View style={styles.option}>
                  {/* <Text style={styles.optionLabel}>Number of Flashcards:</Text>
                  <TouchableOpacity style={styles.dropdown}>
                    <TextInput
                      style={[
                        styles.searchBarPlaceholder,
                        { color: "#A9A9A9" },
                      ]} // placeholder text color
                      keyboardType="numeric"
                      placeholder="Enter number of flashcards"
                      placeholderTextColor="#A9A9A9" // Set placeholder text color
                      onChangeText={(text) => setFlashcardCount(Number(text))}
                      onSubmitEditing={() => Keyboard.dismiss()} // this will close the keyboard when the user clicks on done
                      returnKeyType="done" // "Done" on keyboard
                    />
                  </TouchableOpacity> */}
                  {/* Difficulty Selector */}
                  {/* Flashcard Range Selector */}
                  <View style={styles.option}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          isAllPages && styles.checkedCheckbox,
                        ]}
                        onPress={() => setIsAllPages(!isAllPages)}
                      />
                      <Text style={styles.optionLabel}>All Pages</Text>
                    </View>
                    {!isAllPages && (
                      <View style={styles.pageRangeContainer}>
                        <View style={styles.pageInputContainer}>
                          <Text style={styles.optionLabel}>Start Page:</Text>
                          <TextInput
                            style={styles.pageInput}
                            keyboardType="numeric"
                            placeholder="Enter start page"
                            placeholderTextColor="#A9A9A9"
                            onChangeText={handleStartPage}
                            onBlur={handleDismissKeyboard}
                            returnKeyType="done"
                            onSubmitEditing={handleDismissKeyboard}
                          />
                        </View>
                        <View style={styles.pageInputContainer}>
                          <Text style={styles.optionLabel}>End Page:</Text>
                          <TextInput
                            style={styles.pageInput}
                            keyboardType="numeric"
                            placeholder={`Enter end page (Max: ${numberOfPages})`}
                            placeholderTextColor="#A9A9A9"
                            onChangeText={handleEndPageInput}
                            onBlur={handleDismissKeyboard}
                            returnKeyType="done"
                            onSubmitEditing={handleDismissKeyboard}
                          />
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.option}>
                    <Text style={styles.optionLabel}>Length:</Text>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() =>
                        setShowKeytermLengthOptions(!showKeytermLengthOptions)
                      }
                    >
                      <Text style={styles.dropdownText}>
                        {length || "Select"}
                      </Text>
                    </TouchableOpacity>
                    {showKeytermLengthOptions && (
                      <View style={styles.dropdownOptions}>
                        {["Short", "Medium", "Long"].map((keytermLength) => (
                          <TouchableOpacity
                            key={keytermLength}
                            style={styles.dropdownOption}
                            onPress={() => {
                              setLength(keytermLength);
                            }}
                          >
                            <Text style={styles.dropdownOptionText}>
                              {keytermLength}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
                {/* Difficulty Selector */}
                <View style={styles.option}>
                  <Text style={styles.optionLabel}>Difficulty:</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() =>
                      setShowKeytermDifficultyOptions(
                        !showKeytermDifficultyOptions
                      )
                    }
                  >
                    <Text style={styles.dropdownText}>
                      {difficulty || "Select"}
                    </Text>
                  </TouchableOpacity>
                  {showKeytermDifficultyOptions && (
                    <View style={styles.dropdownOptions}>
                      {["Easy", "Intermediate", "Advanced"].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={styles.dropdownOption}
                          onPress={() => {
                            setDifficulty(level);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{level}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                {/* Actions */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => setKeytermModalVisible(false)}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.popupbuttonText}>
                    <Button
                      title="Generate"
                      onPress={() => {
                        handleGenerateKeyTerms();
                        setKeytermModalVisible(false);
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/*Edit Keyterm Modal*/}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancelEdit}
          >
            <View style={styles.transparentModalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Keyterm</Text>
                {currentKeyterm && (
                  <>
                    <TextInput
                      style={[styles.modalInput, { minHeight: 50 }]} // Adjusted for multiline
                      value={currentKeyterm.term}
                      onChangeText={(text) =>
                        setCurrentKeyterm((prev) =>
                          prev ? { ...prev, term: text } : null
                        )
                      }
                      placeholder="Edit Term"
                      multiline={true} // Enable multiline
                      textAlignVertical="top" // Align text to the top
                    />
                    <TextInput
                      style={[styles.modalInput, { minHeight: 100 }]} // Larger for the definition
                      value={currentKeyterm.definition}
                      onChangeText={(text) =>
                        setCurrentKeyterm((prev) =>
                          prev ? { ...prev, definition: text } : null
                        )
                      }
                      placeholder="Edit Definition"
                      multiline={true} // Enable multiline
                      textAlignVertical="top" // Align text to the top
                    />
                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveKeyterm}
                      >
                        <Text style={styles.actionTextSave}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelEdit}
                      >
                        <Text style={styles.actionTextCancle}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
          {/* Key Terms */}
          {/* <ScrollView style={styles.keyTermsContainer}>
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
          {/* {selectedTerm && (
            <View style={styles.definitionContainer}>
              <Text style={styles.definitionTitle}>Definition</Text>
              <Text style={styles.definitionText}>
                {selectedTerm.definition}
              </Text>
            </View>
          )}  */}
          <FlatList
            data={keyTerms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.keyTermCard}
                  onPress={() => toggleDefinition(parseInt(item.id))}
                >
                  <Text style={styles.keyTermText}>❓ {item.term}</Text>
                  <TouchableOpacity style={styles.keyTermbuttonContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteKeyTerm(item.id)} // Pass the specific flashcard ID
                    >
                      <FlashcardIcon
                        name="trash-outline"
                        size={20}
                        color="#F44336"
                      />
                    </TouchableOpacity>
                    {item.type === 1 && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                          handleGoToPage(
                            item.term,
                            item.definition,
                            item.page,
                            "K"
                          )
                        }
                      >
                        <LottieView
                          style={{ width: 35, height: 35 }}
                          source={require("../../../assets/blackeye.json")}
                          autoPlay
                          loop
                        />
                        <Text> {item.page}</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditKeyterm(item)}
                    >
                      <FlashcardIcon
                        name="create-outline"
                        size={20}
                        color="green"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyTermDefinition}>
                  {activeKey === parseInt(item.id) && (
                    <Text style={styles.definitionText}>
                      💡 {item.definition}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
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
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "transparent",
    width: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: "#1CA7EC",
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#ff90b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight:500,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(169, 220, 254)",
    zIndex: 1,
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
  // progressContainer: {
  //   flexDirection: "row",
  //   marginTop: 20,
  // },
  // progressDot: {
  //   width: 10,
  //   height: 10,
  //   backgroundColor: "#CCC",
  //   borderRadius: 5,
  //   marginHorizontal: 5,
  // },
  // activeDot: {
  //   backgroundColor: "#FFD700",
  // },
  // flagImage: {
  //   width: 30,
  //   height: 30,
  // },
  icon: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    right: 10,
    top: 10,
  },
  searchBar: {
    height: 40,
    marginVertical: 10,
    backgroundColor: "#ececec",
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
  },
  searchBarText: {
    color: "#333",
  },
  searchBarPlaceholder: {
    color: "#A9A9A9", // Dark gray color for placeholder text
  },
  // Key Terms Styles
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
    marginVertical: 5,
    backgroundColor: "#92e1ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  keyTermbuttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  keyTermsContainer: {
    flex: 1,
    marginBottom: 10,
  },
  keyTermCard: {
    backgroundColor: "#aee4ff",

    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyTermDefinition: {
    backgroundColor: "#FFF",
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 15,
    marginBottom: 15,
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
    padding: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  actionTextSave: {
    marginLeft: 5,
    fontSize: 16,
    color: "blue",
  },
  actionTextCancle: {
    marginLeft: 5,
    fontSize: 16,
    color: "red",
    backgroundColor: "transparent",
  },
  saveButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  // Flashcard Styles
  flashcardContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    width: "100%",
    height: "100%",
    padding: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  flashcardCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flashcardContent: {
    marginBottom: 10,
  },
  flashcardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingLeft: 10,
  },
  flashcardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    alignContent: "center",
  },
  flashcardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flashcardButton: {
    top: -10,
    width: 100,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#1f93e0",
    borderRadius: 20,
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",

    height: 35,
  },
  // flashcard Pop-up
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccdee4",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff90b3",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  manualButton: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f93e0",
    padding: 11,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  popupbuttonText: {
    marginLeft: 7,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  popupmodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "70%",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#f0f3fa",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    color: "#333",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
    paddingLeft: 10,
  },
  option: {
    marginBottom: 5,
    color: "#444",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#000",
  },
  picker: {
    height: 100,
    width: "100%",
  },
  actionButtons: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    color: "#aed7ed",
  },
  cancleButton: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    color: "#aed7ed",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    zIndex: 55,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 16,
    zIndex: 56,
    overflow: "hidden",
  },
  dropdownOptions: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginTop: 35,
    zIndex: 56,
    overflow: "hidden",
    justifyContent: "center",
    width: "100%",
  },
  dropdownOption: {
    padding: 10,
    zIndex: 55,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginStart: 10,
  },
  dropdownOptionText: {
    fontSize: 16,
    zIndex: 55,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  flashcardInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15, // Increased padding for larger input area
    marginVertical: 10, // Space between inputs
    backgroundColor: "#fff",
    minHeight: 50, // Minimum height for the input field
    textAlignVertical: "top", // Ensures text starts at the top
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    minHeight: 40,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transparentModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  pageInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  pageInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  checkbox: {
    width: 30,
    height: 30,
    marginRight: 4,
  },
  checkedCheckbox: {
    backgroundColor: "transparent",
  },
});

export default PdfViewer;

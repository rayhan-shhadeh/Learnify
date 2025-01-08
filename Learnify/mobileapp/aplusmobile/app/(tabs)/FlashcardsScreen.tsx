import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Back from "./Back";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  FlashcardScreen: { fileId: string };
};

type FlashcardScreenRouteProp = RouteProp<
  RootStackParamList,
  "FlashcardScreen"
>;

const FlashcardsScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const files = ["File1.pdf", "File2.docx", "File3.txt"]; // Example files
  const route = useRoute<FlashcardScreenRouteProp>();
  const { fileId } = route.params;

  const toggleFileSelection = (fileName: string) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter((file) => file !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const renderFileItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.fileItem,
        selectedFiles.includes(item) && styles.fileItemSelected,
      ]}
      onPress={() => toggleFileSelection(item)}
    >
      <Text style={styles.fileText}>{item}</Text>
      {selectedFiles.includes(item) && (
        <Icon name="checkmark-circle" size={20} color="green" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/images/a-plus-3.png')} style={styles.logo} /> */}

      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Back
          title={""}
          onBackPress={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Flashcards</Text>

      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require("../../assets/images/smartflashcard1.gif")}
          style={styles.icon}
        />
        <Image
          source={require("../../assets/images/manualflashcard.gif")}
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.mainButton, styles.smartButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Smart Flashcards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainButton, styles.manualButton]}
          onPress={() => router.push("../(tabs)/Flashcards/ManualFlashcard")}
        >
          <Text style={styles.buttonText}>Manual Flashcards</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={30}
              color="#ff4757"
              onPress={() => setModalVisible(false)}
            />
            <Text style={styles.modalTitle}>Select Files</Text>
            <FlatList
              data={files}
              keyExtractor={(item) => item}
              renderItem={renderFileItem}
              style={styles.fileList}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.generateButton]}
                onPress={() => {
                  console.log("Generating flashcards from:", selectedFiles);
                  setModalVisible(false);
                  router.push("../(tabs)/GenerateFlashcardsScreen");
                }}
              >
                <Text style={styles.modalButtonText}>Generate Flashcards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => {
                  console.log("Navigating to Add Files screen...");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Add Files</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  function navigateToManualFlashcard(fileId: string) {
    router.push("../(tabs)/ManualFlashcard");
    <param name="fileId" value="fileId" />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f3",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e90ff",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  mainButton: {
    flex: 1,
    padding: 15,
    margin: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  smartButton: {
    backgroundColor: "#16a085",
  },
  manualButton: {
    backgroundColor: "#2980b9",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  fileList: {
    maxHeight: 250,
    width: "100%",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  fileItemSelected: {
    backgroundColor: "#dff9fb",
  },
  fileText: {
    fontSize: 18,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: "#2ecc71",
  },
  addButton: {
    backgroundColor: "#3498db",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 30,
  },
  icon: {
    width: 100,
    height: 100,
    marginHorizontal: 20,
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  backArrow: {
    position: "absolute",
    top: 40,
    left: 20,
  },
});

export default FlashcardsScreen;

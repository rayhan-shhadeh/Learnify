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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  FlashcardScreen: { fileId: string };
};

type FlashcardScreenRouteProp = RouteProp<RootStackParamList, 'FlashcardScreen'>;


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

        <TouchableOpacity style={styles.backArrow} onPress={() => router.back()} >
        <Back title={""} onBackPress={function (): void {
          throw new Error("Function not implemented.");
        } }/>
      </TouchableOpacity>
      <Text style={styles.title}>Flashcards</Text>

<TouchableOpacity style={styles.iconContainer}>

<Image source={require('../../assets/images/smartflashcard1.gif')} style={styles.smarticon} />
<Image source={require('../../assets/images/manualflashcard.gif')} style={styles.manualicon} />

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
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="close" size={24} color="#333" onPress={() => setModalVisible(false)} />
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mainButton: {
    flex: 1,
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  smartButton: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
  },
  manualButton: {
    backgroundColor: "#2196F3",
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  fileList: {
    maxHeight: 200,
    marginBottom: 15,
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: "#4CAF50",
  },
  addButton: {
    backgroundColor: "#2196F3",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backArrow: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backArrowIcon: {
    fontSize: 24,
    color: "#111517",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 70,
    marginLeft: 40,
    top: 10,
    alignContent: "center",
  },
  smarticon: {
    width: 60,
    height: 60,
    marginLeft: 40,
    top: 10,
    
  },
  manualicon: {
    width: 60,
    height: 60,
    marginLeft: 40,
    top: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
});
export default FlashcardsScreen;

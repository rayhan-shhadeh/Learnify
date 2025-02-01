import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import API from "@/api/axois";
import { useLocalSearchParams, router, useRouter } from "expo-router";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";
import LottieView from "lottie-react-native";

const CreateFlashcardScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { passedFileId } = useLocalSearchParams();
  const [flashcardName, setFlashcardName] = useState("");
  const [flashcardQ, setFlashcardQ] = useState("");
  const [flashcardA, setFlashcardA] = useState("");
  const [message, setMessage] = useState("");

  const randomGradient = () => {
    const colors: [string, string, ...string[]][] = [
      ["#FF99BE", "#FFC2D9"], // Soft pink → rich pastel pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateFlashcard = async () => {
    if (!flashcardQ || !flashcardA) {
      setMessage("All fields are required!");
      return;
    }
    setFlashcardName("Flachcard" + passedFileId);

    const flashcardData = {
      flashcardName,
      flashcardQ,
      flashcardA,
      type: 0,
      page: 0,
      file: {
        connect: {
          fileId: parseInt(passedFileId),
        },
      },
    };
    try {
      await API.post("/api/flashcard", flashcardData);
      setMessage("Flashcard created successfully!");
      setFlashcardQ("");
      setFlashcardA("");
      const activeTab = "Flashcards"; //"PDF" | "Flashcards" | "KeyTerms"
      router.replace({
        pathname: "/Files/PdfScreen",
        params: { passedFileId, activeTab },
      });
      //navigation.pop();
    } catch (error) {
      console.error(error);
      setMessage("Failed to create flashcard.");
    }
  };

  return (
    <LinearGradient colors={randomGradient()} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Manual Flashcard</Text>
        <TextInput
          style={styles.inputLarge}
          placeholder="Question"
          value={flashcardQ}
          onChangeText={setFlashcardQ}
          enablesReturnKeyAutomatically
          keyboardAppearance="dark"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <TextInput
          style={styles.inputLarge}
          placeholder="Answer"
          value={flashcardA}
          onChangeText={setFlashcardA}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        {message ? (
          <Text
            style={[
              styles.message,
              message.includes("success") ? styles.success : styles.error,
            ]}
          >
            {message}
          </Text>
        ) : null}
        <LottieView
          style={styles.logo}
          source={require("@/assets/manualflashcards.json")}
          autoPlay
          loop
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateFlashcard}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Create Flashcard</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
    height: "90%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 0,
    marginTop: -20
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputLarge: {
    height: 100,
    textAlignVertical: "top",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 15,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
});

export default CreateFlashcardScreen;

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import API from "@/api/axois";
import { useLocalSearchParams,useRouter } from "expo-router";

const CreateKeyTermScreen = () => {
  const router = useRouter();
  const {passedFileId}=useLocalSearchParams();
  const [flashcardName, setFlashcardName] = useState("");
  const [keytermText, setKeytermText] = useState("");
  const [keytermDef, setKeytermDef] = useState("");
  const [message, setMessage] = useState("");
  const randomGradient = () => {
    const colors: [string, string, ...string[]][] = [
      ["#6a11cb", "#2575fc"],
      ["#ff758c", "#ff7eb3"],
      ["#43cea2", "#185a9d"],
      ["#00c6ff", "#0072ff"],
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


  const handleCreateKeyTerm = async () => {
    if (!keytermText || !keytermDef) {
      setMessage("All fields are required!");
      return;
    }
    setFlashcardName("Flachcard" + passedFileId);
  
    const keyTermData = {
      keytermText,
      keytermDef,
      type: 0,
      page: 0,
      file: {
        connect: {
          fileId: parseInt(passedFileId),
        },
      },
    };
    try {
      await API.post("/api/keyterm", keyTermData);
      setMessage("Flashcard created successfully!");
      setKeytermText("");
      setKeytermDef("");
      const activeTab = 'KeyTerms'//"PDF" | "Flashcards" | "KeyTerms"
      router.replace({
        pathname: '/Files/PdfScreen',
        params: { passedFileId ,activeTab},
      });
      //navigation.pop();
    } catch (error) {
      console.error(error);
      setMessage("Failed to create key term.");
    }
  };
  
  return (
    <LinearGradient colors={randomGradient()} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Key Term</Text>
        <Image
          source={require("../../../assets/images/manualflashcard.gif")}
          style={styles.logo}
        />
                <TouchableOpacity style={styles.button} onPress={handleCreateKeyTerm}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Create Key Term</Text>
          </LinearGradient>
        </TouchableOpacity>


        <TextInput
          style={styles.inputLarge}
          placeholder="key term"
          multiline
          value={keytermText}
          onChangeText={setKeytermText}
        />
        <TextInput
          style={styles.inputLarge}
          placeholder="Definition"
          multiline
          value={keytermDef}
          onChangeText={setKeytermDef}
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
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
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
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 25,
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

export default CreateKeyTermScreen;

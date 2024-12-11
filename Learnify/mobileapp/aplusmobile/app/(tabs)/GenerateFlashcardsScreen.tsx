import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  Button,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Back from "./Back";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
const GenerateFlashcardsScreen = () => {
  const router = useRouter();
  const flashcards = [
    { id: "1", title: "Flashcard 1", description: "Description 1" },
    { id: "2", title: "Flashcard 2", description: "Description 2" },
    { id: "3", title: "Flashcard 3", description: "Description 3" },
  ];

  const renderFlashcard = ({ item }: { item: { id: string; title: string; description: string } }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="create-outline" size={20} color="#6b2905" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="checkmark-done-circle-outline" size={20} color="#11ad0c" />
          <Text style={styles.actionText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="trash-outline" size={20} color="#F44336" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ddf3f5','#f7f7f7','#fbfbfb', '#9ad9ea']} style={styles.container}>
      <Back title={""} onBackPress={function (): void {} }/>
      <Text style={styles.title}>Generated Flashcards</Text>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.id}
        renderItem={renderFlashcard}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/StudyFlashcardsScreen")}>
        <Text style={styles.buttonText}>Study Flashcards</Text>
      </TouchableOpacity>
      </LinearGradient>
    </View>
  );
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
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

 export default GenerateFlashcardsScreen;

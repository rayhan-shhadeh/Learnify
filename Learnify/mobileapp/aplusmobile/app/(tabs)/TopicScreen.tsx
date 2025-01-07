import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TopicScreen = () => {
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  const isPremium = false; // Set to true to unlock all cards

  const flashcards = [
    {
      id: "1",
      question: "What is React?",
      answer: "A JavaScript library for building user interfaces.",
    },
    {
      id: "2",
      question: "What is a Component?",
      answer: "Reusable building blocks in React.",
    },
    {
      id: "3",
      question: "What is State?",
      answer: "A way to manage dynamic data in React.",
    },
    {
      id: "4",
      question: "What is JSX?",
      answer: "JavaScript XML for creating React elements.",
    },
    {
      id: "5",
      question: "What is useEffect?",
      answer: "A hook to handle side effects in React.",
    },
    {
      id: "6",
      question: "What is Context API?",
      answer: "A way to manage global state in React.",
    },
    {
      id: "7",
      question: "What is Redux?",
      answer: "A predictable state container for JS apps.",
    },
  ];

  const handleFlip = (id: string) => {
    if (isPremium || parseInt(id) <= 5) {
      setFlippedCards((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const renderItem = ({
    item,
  }: {
    item: { id: string; question: string; answer: string };
  }) => {
    const isLocked = !isPremium && parseInt(item.id) > 5;
    const isFlipped = flippedCards[item.id];

    return (
      <TouchableOpacity
        onPress={() => handleFlip(item.id)}
        activeOpacity={0.9}
        style={styles.cardContainer}
      >
        <View style={[styles.card, isLocked && styles.lockedCard]}>
          {isLocked ? (
            <View style={styles.lockedContent}>
              {/* <Ionicons name="lock-closed-outline" size={40} color="#888" /> */}
              <Image
                source={require("../../assets/images/lock.png")}
                style={{ width: 50, height: 50 }}
              />
            </View>
          ) : (
            <Text style={styles.cardText}>
              {isFlipped ? item.answer : item.question}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards for x topic</Text>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  card: {
    width: screenWidth * 0.9,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#85c4e4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  lockedCard: {
    backgroundColor: "#ddd",
    opacity: 0.6,
  },
  lockedContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TopicScreen;

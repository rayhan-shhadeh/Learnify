import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Badge } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import Header from "../header/Header";
import LottieView from "lottie-react-native";

interface Question {
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
  choices: string[];
  questionId: number;
}

interface QuizData {
  title: string;
  description: string;
  score: number;
  questions: Question[];
}

const QuizReviewScreen: React.FC = () => {
  // Constant API response
  const quizData: QuizData = {
    title: "Data Encryption Standard (DES) Quiz",
    description:
      "This quiz covers key concepts and structural elements of the DES encryption algorithm.",
    score: 2,
    questions: [
      {
        questionText:
          "What is the purpose of the initial permutation before round 1 in the DES algorithm?",
        correctAnswer: "A",
        userAnswer: "A",
        choices: [
          "It's mainly for historical reasons and not for added security.",
          "It significantly increases the encryption security.",
          "It makes the encryption process faster.",
          "It ensures data integrity.",
        ],
        questionId: 38,
      },
      {
        questionText:
          "What happens to the data halves after the last round of encryption in DES?",
        correctAnswer: "B",
        userAnswer: "C", // User answered incorrectly
        choices: [
          "They are recombined without any further processing.",
          "They are swapped as part of the encryption structure.",
          "They are discarded as they are no longer needed.",
          "They undergo an additional encryption round.",
        ],
        questionId: 39,
      },
      {
        questionText:
          "Why is the final permutation applied in the DES process?",
        correctAnswer: "C",
        userAnswer: "C", // User answered correctly
        choices: [
          "To encrypt the output further.",
          "To enhance the cryptographic strength.",
          "To make the process reversible for decryption.",
          "To rearrange the output for better readability.",
        ],
        questionId: 40,
      },
    ],
  };

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Toggle visibility of choices
  const toggleExpand = (questionId: number) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const renderChoice = (
    choice: string,
    correctAnswer: string,
    userAnswer: string,
    index: number
  ) => {
    const isCorrect = correctAnswer === String.fromCharCode(65 + index);
    const isUserAnswer = userAnswer === String.fromCharCode(65 + index);
    let backgroundColor = "#f7f7f7";

    // If the user selected this answer
    if (isUserAnswer) {
      backgroundColor = isCorrect ? "#a4f9a4" : "#f9a4a4"; // Green for correct, red for wrong
    }
    // If this choice is the correct answer, but not selected by the user
    else if (isCorrect) {
      backgroundColor = "#d3f9d3"; // Light green for correct but unselected
    }

    return (
      <Animatable.View
        key={index}
        animation="fadeIn"
        delay={100 * index}
        style={[styles.choiceContainer, { backgroundColor }]}
      >
        <Text style={styles.choiceText}>{choice}</Text>
      </Animatable.View>
    );
  };

  const renderQuestion = ({ item }: { item: Question }) => {
    const isExpanded = expandedQuestion === item.questionId;

    return (
      <View style={styles.questionContainer}>
        <TouchableOpacity onPress={() => toggleExpand(item.questionId)}>
          <Text style={styles.questionText}>{item.questionText}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <Animatable.View animation="fadeIn" delay={200}>
            {item.choices.map((choice, index) =>
              renderChoice(choice, item.correctAnswer, item.userAnswer, index)
            )}
          </Animatable.View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.title}>{quizData.title}</Text>
        <Text style={styles.fileName}>generated from DOS file</Text>
        <LottieView
          source={require("../../../assets/quiz.json")}
          autoPlay
          loop={false}
          speed={1}
          style={styles.fire}
        />
        <Badge
          value={`${quizData.score} / ${quizData.questions.length}`}
          status="success"
          badgeStyle={styles.badge}
          textStyle={styles.badgeText}
        />
      </View>
      <FlatList
        data={quizData.questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.questionId.toString()}
        contentContainerStyle={styles.questionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#92e1ff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",

    marginBottom: 20,
  },
  fileName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  badge: {
    backgroundColor: "#b0c4de",
    padding: 10,
    height: 50,
    width: 150,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
  },
  questionsList: {
    paddingBottom: 20,
  },
  questionContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  choiceContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  choiceText: {
    fontSize: 14,
    color: "#111",
  },
  fire: {
    width: 90,
    height: 90,
    marginBlock: 5,
    overflow: "hidden",
    zIndex: 1,
  },
});

export default QuizReviewScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Badge } from "react-native-elements";
import Header from "../header/Header";
import LottieView from "lottie-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "@/api/axois";

interface Question {
  questionId: number;
  questionText: string;
  correctAnswer: string;
  selectedAnswer: string;
  choices: string[];
}

interface QuizData {
  title: string;
  description: string;
  score: number;
  questions: Question[];
}

const QuizReviewScreen: React.FC = () => {
  const router = useRouter();
  const { passedQuizId,passedIsFromAllFilesPage, passedCourseId} = useLocalSearchParams();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const handleFinishReview = async () => {
    if (passedIsFromAllFilesPage === "all") {
      router.push("/(tabs)/FilesScreen");
    } else if (passedIsFromAllFilesPage === "course") {
      const data = await API.get(`/api/course/${passedCourseId}`);
      const title = data.data.courseName;
      router.push({
        pathname: "/(tabs)/CourseFilesScreen",
        params: { title, passedCourseId }
      });
    } else if (passedIsFromAllFilesPage === "home") {
      router.push("/(tabs)/HomeScreen");
    } else if (passedIsFromAllFilesPage === "history") {
      router.push("/(tabs)/quiz/QuizMainScreen");
    } else {
      router.push("/(tabs)/HomeScreen");
    }
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        // Fetch quiz metadata
        const quizResponse = await API.get(`api/quiz/${passedQuizId}`);
        const quiz = quizResponse.data;

        // Fetch questions for the quiz
        const questionsResponse = await API.get(`api/quiz/questions/${passedQuizId}`);
        const questions = questionsResponse.data;

        console.log("Fetched questions:", questions); // Debug log

        // Fetch user's answers for each question
        const answersPromises = questions.map((question: any) =>
          API.get(`/api/quiz/question/answer/${question.questionId}`)
            .then((res) => res.data)
            .catch((err) => {
              console.warn(`Failed to fetch answers for questionId ${question.questionId}:`, err.message);
              return null;
            })
        );

        const answersArray = await Promise.all(answersPromises);

        // Format questions with parsed `choices` and user's answers
        const formattedQuestions: Question[] = questions.map((question: any, index: number) => {
          const answer = answersArray[index];
          return {
            questionId: question.questionId,
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            selectedAnswer: answer ? answer.chosenAnswer : "",
            choices: 
            question.choices.includes(",")
            ? question.choices
                .replace(/"/g, "") // Remove double quotes
                .split(",") // Split by ","
                .map((choice: string) => choice.trim()) // Trim each choice
            : JSON.parse(question.choices), // Fallback for JSON
          };
        });
    
        // Set quiz data state
        setQuizData({
          title: quiz.quizTitle,
          description: quiz.quizDescription,
          score: quiz.score,
          questions: formattedQuestions,
        });
      } catch (error) {
        console.error("Failed to fetch quiz data!!");
      } finally {
        setLoading(false);
      }
    };

    if (passedQuizId) {
      fetchQuizData();
    }
  }, [passedQuizId]);

  const renderQuestion = ({ item, index }: { item: Question; index: number }) => {
    const isExpanded = expandedQuestionIndex === index;
    const isCorrect = item.selectedAnswer === item.correctAnswer;
  
    return (
      <View style={styles.reviewItem}>
        {/* Question */}
        <TouchableOpacity
          style={[
            styles.questionContainer,
            isCorrect
              ? styles.correctChoice
              : item.selectedAnswer
              ? styles.incorrectChoice
              : null,
          ]}
          onPress={() => setExpandedQuestionIndex(isExpanded ? null : index)}
        >
          <Text
            style={[
              styles.reviewQuestionText,
              {
                color: isCorrect
                  ? "green" // Green for correct answers
                  : item.selectedAnswer
                  ? "red" // Red for incorrect answers
                  : "#333", // Default color for unanswered
              },
            ]}
          >
            {index + 1}. {item.questionText}
          </Text>
        </TouchableOpacity>
  
        {/* Choices */}
        {isExpanded && (
          <FlatList
            data={item.choices}
            keyExtractor={(choice, choiceIndex) => choiceIndex.toString()}
            renderItem={({ item: choice }) => {
              const isUserChoice = choice === item.selectedAnswer;
              const isCorrectChoice = choice === item.correctAnswer;
  
              return (
                <View
                  style={[
                    styles.choiceContainer,
                    isUserChoice && !isCorrectChoice
                      ? styles.incorrectChoice // User's wrong answer
                      : isCorrectChoice
                      ? styles.correctChoice // Correct answer
                      : null, // Neutral
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      {
                        color: isUserChoice && !isCorrectChoice
                          ? "red"
                          : isCorrectChoice
                          ? "green"
                          : "#111",
                      },
                    ]}
                  >
                    {choice}
                    {isUserChoice && !isCorrectChoice
                      ? " (Your Answer)"
                      : isCorrectChoice
                      ? " (Correct)"
                      : ""}
                  </Text>
                </View>
              );
            }}
            contentContainerStyle={styles.choicesContainer}
          />
        )}
      </View>
    );
  };
      
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!quizData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load quiz data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.title}>{quizData.title}</Text>
        <Text style={styles.fileName}>{quizData.description}</Text>
        <LottieView
          source={require("../../../assets/quiz.json")}
          autoPlay
          loop={false}
          speed={1}
          style={styles.fire}
        />
        <Badge
          value={`Score: ${quizData.score} / 100`}
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
              <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishReview}
        >
          <Text style={styles.buttonText}>Finish Review</Text>
        </TouchableOpacity>

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
  },
  badge: {
    backgroundColor: "#b0c4de",
    padding: 10,
    height: 50,
    width: 200,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
  },
  questionsList: {
    paddingBottom: 20,
  },
  reviewItem: {
    marginBottom: 16,
  },
  questionContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewQuestionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  choicesContainer: {
    marginTop: 8,
  },
  choiceContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#f7f7f7",
  },
  correctChoice: {
    backgroundColor: "#a4f9a4", // Green for correct answers
  },
  incorrectChoice: {
    backgroundColor: "#f9a4a4", // Red for incorrect answers
  },
  choiceText: {
    fontSize: 14,
    color: "#111",
  },
  fire: {
    width: 90,
    height: 90,
    marginVertical: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f8",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f8",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
  }
  ,  finishButton: {
    backgroundColor: "#1CA7EC",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },


});

export default QuizReviewScreen;

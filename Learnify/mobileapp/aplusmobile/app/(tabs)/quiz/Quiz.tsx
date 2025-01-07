import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import API from '../../../api/axois';
import { useLocalSearchParams } from 'expo-router';

// Define types for quiz, question, and choices
interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  questionId: number;
  choices: Choice[];
  selectedAnswer?: string;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

const Quiz = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(true);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [quizId, setQuizId] = useState<number | null>(null);
  const [review, setReview] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const { passedFileId, passedIsFromAllFilesPage, passedCourseId } = useLocalSearchParams();
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Difficult', value: 'difficult' },
  ];

  useEffect(() => {
    if (!popupVisible) {
      generateQuiz();
    }
  }, [popupVisible]);

  const getId = async (): Promise<void> => {
    try {
      const response = await API.get('/api/maxQuizId');
      const id = response.data.maxQuizId + 1;
      setQuizId(id);
    } catch (err) {
      console.error('Error fetching quiz ID:', err);
    }
  };

  const generateQuiz = async () => {
    try {
      await getId();
      const response = await API.post(`/api/file/generateQuiz/${passedFileId}`, {
        numQuestions,
        difficulty,
      });

      if (
        response.data &&
        response.data.title &&
        Array.isArray(response.data.questions)
      ) {
        const Quiz: Quiz = {
          title: response.data.title,
          description: response.data.description || 'No description provided',
          questions: response.data.questions.map((q: any) => ({
            question: q.questionText || 'No question text',
            questionId: q.questionId,
            choices: q.choices.map((choice: string, index: number) => ({
              text: choice,
              isCorrect: String.fromCharCode(65 + index) === q.correctAnswer,
            })),
          })),
        };
        setQuiz(Quiz);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      setError(true);
      console.error('Error generating quiz:', err);
    }
  };

  const handleChoiceClick = async (choice: Choice, id: number): Promise<void> => {
    try {
      await API.post('/api/answer', {
        chosenAnswer: choice.text,
        isCorrect: choice.isCorrect,
        question: { connect: { questionId: id } },
      });

      if (quiz) {
        const updatedQuiz = { ...quiz };
        updatedQuiz.questions[currentQuestionIndex].selectedAnswer = choice.text;
        setQuiz(updatedQuiz);
      }
    } catch (err) {
      console.error('Error storing answer:', err);
      Alert.alert('Error', 'Unable to save your answer. Please try again.');
    }
    setSelectedChoice(choice);
  };

  const handleContinue = (): void => {
    setTimeout(() => {
      if (selectedChoice) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
      setSelectedChoice(null);
    }, 1000);
  };

  const handleScore = async () => {
    if (quiz) {
      const calculatedScore = quiz.questions.reduce((acc, question) => {
        const userAnswer = question.selectedAnswer;
        const correctChoice = question.choices.find((choice) => choice.isCorrect);
        if (userAnswer === correctChoice?.text) {
          return acc + 1;
        }
        return acc;
      }, 0);
      const successRate: number = Math.round((calculatedScore / numQuestions) * 100);

      try {
        if (!quizId) {
          console.error('Quiz ID is not set.');
          return;
        }

        await API.patch(`/api/quiz/${quizId}`, {
          numOfQuestions: numQuestions,
          score: successRate,
        });

        setScore(calculatedScore);
      } catch (err) {
        console.error('Error updating score in the database:', err);
      }
    }
  };

  const handleFinishReview = async () => {
    try {
      if (passedIsFromAllFilesPage === 'all') {
        router.push('/(tabs)/FilesScreen');
      } else if (passedIsFromAllFilesPage === 'course') {
        const data = await API.get(`/api/course/${passedCourseId}`);
        const title = data.data.courseName;
        router.push({
          pathname: '/(tabs)/CourseFilesScreen',
          params: { title, passedCourseId },
        });
      } else if (passedIsFromAllFilesPage === 'home') {
        router.push('/(tabs)/HomeScreen');
      } else {
        console.error('Invalid navigation parameter');
      }
    } catch (err) {
      console.error('Error during navigation:', err);
      Alert.alert('Navigation Error', 'Unable to navigate back.');
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error generating the quiz!</Text>
      </View>
    );
  }

  if (popupVisible) {
    return (
      <View style={styles.popupContainer}>
        <Text style={styles.bannerText}>
          Unleash your potential and challenge your mind!
        </Text>
        <View style={styles.popup}>
          <Text style={styles.popupLabel}>Number of Questions:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={numQuestions.toString()}
            onChangeText={(text) => {
              const filteredText = text.replace(/[^0-9]/g, '');
              setNumQuestions(filteredText ? Math.max(1, parseInt(filteredText, 10)) : 1);
            }}
          />
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownTriggerText}>
              {difficultyOptions.find((option) => option.value === difficulty)?.label || 'Select Difficulty'}
            </Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownList}>
              {difficultyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setDifficulty(option.value);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setPopupVisible(false)}
          >
            <Text style={styles.buttonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CA7EC" />
        <Text style={styles.loadingText}>Generating Quiz...</Text>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (review) {
    return (
      <View style={styles.reviewContainer}>
        <Text style={styles.scoreText}>
          Your Score: {score}/{numQuestions}
        </Text>
        <FlatList
          data={quiz.questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const userAnswer = item.selectedAnswer;
            const correctChoice = item.choices.find((choice) => choice.isCorrect);
            const isExpanded = expandedQuestionIndex === index;

            return (
              <View style={styles.reviewItem}>
                <TouchableOpacity
                  style={[
                    styles.questionContainer,
                    userAnswer === correctChoice?.text
                      ? styles.correctChoice
                      : styles.incorrectChoice,
                  ]}
                  onPress={() => setExpandedQuestionIndex(index === expandedQuestionIndex ? null : index)}
                >
                  <Text style={styles.reviewQuestionText}>
                    {index + 1}. {item.question}
                  </Text>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.choicesContainer}>
                    {item.choices.map((choice, choiceIndex) => (
                      <View
                        key={choiceIndex}
                        style={[
                          styles.choiceContainer,
                          choice.text === userAnswer
                            ? choice.isCorrect
                              ? styles.correctChoice
                              : styles.incorrectChoice
                            : choice.isCorrect
                            ? styles.correctChoice
                            : null,
                        ]}
                      >
                        <Text style={styles.choiceText}>
                          {choice.text}
                          {choice.text === userAnswer && !choice.isCorrect && ' (Your Answer)'}
                          {choice.isCorrect && ' (Correct)'}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishReview}
        >
          <Text style={styles.buttonText}>Finish Review</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.quizContainer}>
      <View style={styles.questionCountContainer}>
        <Text style={styles.questionCountText}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
      </View>
      <ProgressBar
        progress={(currentQuestionIndex + 1) / quiz.questions.length}
        color="#62D9A2"
        style={styles.progressContainer}
      />
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      {currentQuestion.choices.map((choice, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.choice,
            selectedChoice === choice && {
              backgroundColor: choice.isCorrect ? '#D4EDDA' : '#F8D7DA',
              borderColor: choice.isCorrect ? '#28A745' : '#DC3545',
            },
          ]}
          onPress={() => handleChoiceClick(choice, currentQuestion.questionId)}
          disabled={!!selectedChoice}
        >
          <Text
            style={[
              styles.choiceText,
              selectedChoice === choice && {
                color: choice.isCorrect ? '#155724' : '#721C24',
              },
            ]}
          >
            {choice.text}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.continueButton, !selectedChoice && { backgroundColor: '#ccc' }]}
        onPress={
          currentQuestionIndex + 1 === quiz.questions.length
            ? () => {
                setReview(true);
                handleScore();
              }
            : handleContinue
        }
        disabled={!selectedChoice}
      >
        <Text style={styles.buttonText}>
          {currentQuestionIndex + 1 === quiz.questions.length ? 'Submit' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    // Main Container
    quizContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F9F9F9',
      justifyContent: 'center',
    },
  
    // Popup Styles
    popupContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    bannerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#3785DE',
      textAlign: 'center',
      marginBottom: 20,
    },
    popup: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    popupLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginVertical: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 8,
      fontSize: 16,
      marginBottom: 10,
    },
    startButton: {
      backgroundColor: '#1CA7EC',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
  
    // Question Section
    questionText: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
  
    // Choices Section
    choice: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    selected: {
      backgroundColor: '#E6F7FF',
      borderWidth: 1,
      borderColor: '#1CA7EC',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    choiceText: {
      fontSize: 16,
      color: '#333',
    },
  
    // Progress Bar
    progressContainer: {
      marginBottom: 24,
    },
  
    // Continue/Submit Button
    continueButton: {
      backgroundColor: '#62D9A2',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  
    // Review Section
    reviewContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F9F9F9',
    },
    scoreText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#3785DE',
    },
    reviewItem: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    reviewText: {
      fontSize: 16,
      color: '#333',
    },
    finishButton: {
      backgroundColor: '#1CA7EC',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
  
    // Error Styles
    error: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      color: 'red',
      fontSize: 16,
    },loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9', // Light background to keep it clean and readable
      },
      loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#1CA7EC', // Matches the primary theme color
        fontWeight: '500',
      },  errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F5', // Light red background to indicate an error
      },
      errorText: {
        fontSize: 18,
        color: '#D9534F', // Strong red color for error text
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 20, // Ensure the text is not too close to the edges
      },questionCountContainer: {
        marginBottom: 16,
        alignItems: 'center',
      },
      questionCountText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
      },reviewQuestionText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
      },
      reviewChoice: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 4,
      },
      correctChoice: {
        backgroundColor: '#D4EDDA', // Light green for correct
        borderColor: '#28A745', // Dark green for border
      },
      incorrectChoice: {
        backgroundColor: '#F8D7DA', // Light red for incorrect
        borderColor: '#DC3545', // Dark red for border
      },
      questionContainer: {
        padding: 12,
        borderRadius: 5,
        marginVertical: 8,
      },
      choicesContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 5,
        marginTop: 8,
      },
      choiceContainer: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 4,
      },  dropdownTrigger: {
        width: '100%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
      },
      dropdownTriggerText: {
        fontSize: 16,
        color: 'black',
      },
      dropdownList: {
        width: '100%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
      },
      dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
      },
      dropdownItemText: {
        fontSize: 16,
        color: 'black',
      },
    
      
    
      
   
  });
  
export default Quiz;

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
import axios from 'axios';
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

const Quiz=()=> {
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
  const { passedFileId,passedIsFromAllFilesPage,passedCourseId} = useLocalSearchParams();
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const difficultyOptions = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Difficult', value: 'Difficult' },
  ];

  
  useEffect(() => {
    console.log(passedCourseId);
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

  const generateQuiz = async (): Promise<void> => {
    try {
      console.log("Trying to genrate quiz from file "+passedFileId);
      await getId();
      const response = await API.post(
        `/api/file/generateQuiz/${passedFileId}`,
        {
          numQuestions,
          difficulty,
        }
      );
      const Quiz: Quiz = {
        title: response.data.title,
        description: response.data.description,
        questions: response.data.questions.map((q: any) => ({
          question: q.questionText,
          questionId: q.questionId,
          choices: q.choices.map((choice: string, index: number) => ({
            text: choice,
            isCorrect: String.fromCharCode(65 + index) === q.correctAnswer,
          })),
        })),
      };
      setQuiz(Quiz);
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

  const handleScore = (): void => {
    if (quiz) {
      const calculatedScore = quiz.questions.reduce((acc, question) => {
        const userAnswer = question.selectedAnswer;
        const correctChoice = question.choices.find((choice) => choice.isCorrect);
        if (userAnswer === correctChoice?.text) {
          return acc + 1;
        }
        return acc;
      }, 0);
      setScore(calculatedScore);
    }
  };
  
  const toggleQuestion = (index: number) => {
    setExpandedQuestionIndex(index === expandedQuestionIndex ? null : index);
  };

  const handleFinishReview =async()=>{
    if (passedIsFromAllFilesPage =='all'){
      router.push('/(tabs)/FilesScreen');
    }
    //passedFileId, PassedTitle, passedIsFromAllFilesPage,passedCourseTitle
     
    else if (passedIsFromAllFilesPage =='course'){
       const data = await API.get(`/api/course/${passedCourseId}`)
      const title = data.data.courseName;
      router.push({
        pathname: '/(tabs)/CourseFilesScreen',
        params: { title,passedCourseId},
      })
    }
  }

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
            const filteredText = text.replace(/[^0-9]/g, ''); // Filter non-numeric input
            setNumQuestions(filteredText ? parseInt(filteredText, 10) : 1); // Default to 1 if empty
          }}
        />
        {/* Dropdown Trigger */}
        <TouchableOpacity
          style={styles.dropdownList}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownTriggerText}>
            {difficulty
              ? difficultyOptions.find((option) => option.value === difficulty)?.label
              : 'Difficulty'}
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
                  setShowDropdown(false); // Close dropdown after selection
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

  if (!quiz) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CA7EC" />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  if (review) {
    return (
      <View style={styles.reviewContainer}>
        {/* Display the Score */}
        <Text style={styles.scoreText}>
          Your Score: {score}/{numQuestions}
        </Text>
  
        {/* List of Questions */}
        <FlatList
          data={quiz.questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const userAnswer = item.selectedAnswer;
            const correctChoice = item.choices.find((choice) => choice.isCorrect);
            const isExpanded = expandedQuestionIndex === index;
  
            return (
              <View style={styles.reviewItem}>
                {/* Question with Correctness Color */}
                <TouchableOpacity
                  style={[
                    styles.questionContainer,
                    userAnswer === correctChoice?.text
                      ? styles.correctChoice
                      : styles.incorrectChoice,
                  ]}
                  onPress={() => toggleQuestion(index)}
                >
                  <Text style={styles.reviewQuestionText}>
                    {index + 1}. {item.question}
                  </Text>
                </TouchableOpacity>
  
                {/* Show Choices and Answers if Expanded */}
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
                          {choice.text === userAnswer && !choice.isCorrect && " (Your Answer)"}
                          {choice.isCorrect && " (Correct)"}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
  
        {/* Finish Review Button */}
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => handleFinishReview()}
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
        backgroundColor: choice.isCorrect
          ? '#D4EDDA' // Light green for correct
          : '#F8D7DA', // Light red for incorrect
        borderColor: choice.isCorrect ? '#28A745' : '#DC3545', // Darker green/red for border
      },
    ]}
    onPress={() => handleChoiceClick(choice, currentQuestion.questionId)}
    disabled={!!selectedChoice} // Disable choices after one is selected
  >
    <Text
      style={[
        styles.choiceText,
        selectedChoice === choice && {
          color: choice.isCorrect ? '#155724' : '#721C24', // Adjust text color based on correctness
        },
      ]}
    >
      {choice.text}
    </Text>
  </TouchableOpacity>
))}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={
          currentQuestionIndex + 1 === quiz.questions.length
            ? () => {
                setReview(true);
                handleScore();
              }
            : handleContinue
        }
      >
        <Text style={styles.buttonText}>
          {currentQuestionIndex + 1 === quiz.questions.length
            ? 'Submit'
            : 'Continue'}
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

import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import Back from './Back';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const StudyFlashcardsScreen = () => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [expression, setExpression] = useState('');
  const [expressionVisible, setExpressionVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;


  const flashcards = [
    { question: "What is React?", answer: "A JavaScript library for building UI." },
    { question: "What is SM2?", answer: "A spaced repetition algorithm for learning." },
    { question: "What's your name?", answer: "My name is Rayhan." },
    { question: "What is the definition of SM2?", answer: "Super Memory 2 Algorithm." },
    { question: "Front card?", answer: "Back card." },
  ];

  const expressions = [
    "Oops! That was a *brain freeze* 🧊... but hey, now I remember! 😅",
    "I got it wrong, but it clicked like a lightbulb 💡! Easy peasy, lemon squeezy 🍋!",
    "Phew, got it right, but my brain had to run a marathon 🏃💨 to recall it!",
    "I got it right, but it took a *moment of drama*... suspense was real 🎭🤔",
    "Nailed it! Perfect recall! 🏆 I’m a memory master 🧠💪",
  ];

  const handleRating = (rating: number) => {
    setExpression(expressions[rating - 1]);
    setExpressionVisible(true);

    setTimeout(() => {
      setExpressionVisible(false);
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setShowCelebration(true);
      }
    }, 2000);
  };
  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  if (showCelebration) {
    return (
      <LinearGradient colors={['#e8dcf4', '#dbd1e9', '#989eeb', '#989bbe']} style={styles.container}>
        <Back title="Back" onBackPress={() => router.back()} />
        <View style={styles.celebrationContainer}>
           <LottieView
            source={require('../../../aplusmobile/assets/prize.json')} // Place your Lottie file in the project directory
            autoPlay
            loop={true}
            style={styles.lottie}
          /> 
            <Animatable.Text
            animation="bounceIn"
            duration={1500}
            style={styles.congratsText}
            >
            Congratulations! 🎉 You've completed all flashcards!
            </Animatable.Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ddf3f5', '#f7f7f7', '#3681a7', '#21277b']} style={styles.container}>
      <ScrollView style={styles.container}>
        <Back title="Back" onBackPress={() => router.back()} />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Study Flashcards</Text>
        </View>
        <TouchableOpacity onPress={flipCard}>
        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
              {!isFlipped && (
                <Card.Content>
                  <Text style={styles.cardText}>{flashcards[currentCardIndex].question}</Text>
                </Card.Content>
              )}
            </Animated.View>
            <Animated.View style={[styles.card,styles.backcard, { transform: [{ rotateY: backInterpolate }] }]}>
              {isFlipped && (
                <Card.Content>
                  <Text style={styles.cardText}>{flashcards[currentCardIndex].answer}</Text>
                </Card.Content>
              )}
            </Animated.View>
        </TouchableOpacity>


        {expressionVisible && (
          <Animatable.View
            animation="fadeInUp"
            duration={500}
            style={styles.expressionContainer}
          >
            <Text style={styles.expressionText}>{expression}</Text>
          </Animatable.View>
        )}

        <View style={styles.ratingContainer}>
          {["1", "2", "3", "4", "5"].map((rating, index) => (
            <Button
              key={index}
              mode="contained"
              icon={() => (
                <Icon
                  name="star"
                  size={20}
                  color={index + 1 >= 3 ? "#FFD700" : "#ccc"}
                />
              )}
              onPress={() => handleRating(index + 1)}
              style={styles.ratingButton}
            >
              {index + 1}
            </Button>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1ca7ec',
  },
  cardContainer: {
    alignItems: 'center',
    marginVertical: 20,

  },
  card: {
    width: 300,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: 'white',
  },
  backcard: {
    width: 300,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: 'white',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  flipButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  expressionContainer: {
    backgroundColor: '#ffecb3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  expressionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    justifyContent: 'space-around',
    marginTop: 50,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
paddingBlock: 10, 
},
  ratingButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    
  },
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 60,
  },
  lottie: {
    width: 200,
    height: 200,
    flex: 1,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21277b',
    textAlign: 'center',
  
    paddingTop: -10,
    marginBottom: 20,
  },
});

export default StudyFlashcardsScreen;

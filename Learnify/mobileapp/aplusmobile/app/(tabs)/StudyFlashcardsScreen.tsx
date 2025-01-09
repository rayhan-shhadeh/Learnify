import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import API from '../../api/axois';
import Back from './Back';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import {useState,useEffect} from 'react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const PracticeScreen = () => {
  const router = useRouter();
  const { passedFileId } = useLocalSearchParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [finish, setFinish] = useState(false);
  const flipAnim = useState(new Animated.Value(0))[0];
  const [showCelebration, setShowCelebration] = useState(false);

  const gradients: [string, string][] = [
    ['#f9f9f9', '#e8f0ff'],
    ['#fff4e6', '#ffe9f0'],
    ['#f0f9ff', '#e8f0e6'],
    ['#e9f7ff', '#fff7e6'],
    ['#f9efff', '#f9fff9'],
  ];

  const getRandomGradient = (): [string, string] =>
    gradients[Math.floor(Math.random() * gradients.length)];

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await API.post(`/api/file/practice/${passedFileId}`);
        console.log('API Response:', response.data); // Debugging: Log API response
    
        if (Array.isArray(response.data) && response.data.length > 0) {
          const fetchedFlashcards = response.data.map((flashcard) => ({
            id: flashcard.flashcardId,
            question: flashcard.flashcardQ || 'No question available',
            answer: flashcard.flashcardA || 'No answer available',
          }));
          setFlashcards(fetchedFlashcards);
        } else {
          Alert.alert('No Flashcards', 'The API returned no flashcards.');
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        Alert.alert('Error', `Failed to fetch flashcards for file ID ${passedFileId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
    }, [passedFileId]);
    
  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedRating(null);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinish(true);
    }
  };

  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    try {
      await API.post(`/api/file/practice/review/${flashcards[currentIndex].id}`, { rating });
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating');
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (flashcards.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No flashcards available</Text>
      </View>
    );
  }

  if (finish) {
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
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {flashcards.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progress,
              { width: `${((currentIndex + 1) / flashcards.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Flashcard */}
      <TouchableOpacity onPress={handleFlip}>
        <LinearGradient colors={getRandomGradient()} style={styles.flashcard}>
          {!isFlipped ? (
            <Animated.View style={[styles.cardContent, { transform: [{ rotateY: frontInterpolate }] }]}>
              <Text style={styles.cardText}>{flashcards[currentIndex].question}</Text>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.cardContent, { transform: [{ rotateY: backInterpolate }] }]}>
              <Text style={styles.cardText}>{flashcards[currentIndex].answer}</Text>
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Rating */}
      <View style={styles.ratingContainer}>
  {[
    { emoji: '😡', label: 'Very Hard' },
    { emoji: '😞', label: 'Hard' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '🙂', label: 'Easy' },
    { emoji: '😀', label: 'Very Easy' },
  ].map((rating, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.ratingButton,
        selectedRating === index + 1 && styles.selectedRating,
      ]}
      onPress={() => handleRating(index + 1)}
    >
      <Text style={styles.emoji}>{rating.emoji}</Text>
      <Text style={styles.label}>{rating.label}</Text>
    </TouchableOpacity>
  ))}
</View>

      {/* Next Button */}
      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Ionicons name="arrow-forward" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  flashcard: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
  },
  nextButton: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ratingContent: {
    flexDirection: 'row', // Arrange emoji and label horizontally
    alignItems: 'center', // Ensure emoji and text are vertically aligned
  },
  ratingContainer: {
    flexDirection: 'column', // Stack buttons vertically
    justifyContent: 'center', // Center-align the stack
    alignItems: 'center', // Center-align the buttons horizontally
    marginVertical: 20,
  },
  ratingButton: {
    flexDirection: 'row', // Keep emoji and label side-by-side
    alignItems: 'center', // Vertically align emoji and label
    justifyContent: 'center', // Center-align content
    padding: 10,
    marginVertical: 5, // Add spacing between buttons
    width: '80%', // Make buttons take up 80% of the container width
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedRating: {
    backgroundColor: '#007bff', // Highlight selected button
  },
  emoji: {
    fontSize: 20, // Adjust size for emoji
    marginRight: 10, // Space between emoji and label
  },
  label: {
    fontSize: 16, // Normal font size for label
  },  celebrationContainer: {
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

export default PracticeScreen;

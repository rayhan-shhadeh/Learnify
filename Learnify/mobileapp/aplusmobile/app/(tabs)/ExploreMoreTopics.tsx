import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../(tabs)/header/Header";
import NavBar from "./NavBar";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axois";
import LottieView from "lottie-react-native";
const { width, height } = Dimensions.get("window");

const mockData = [
  { id: 1, front: "Flashcard 1 Front", back: "Flashcard 1 Back" },
  { id: 2, front: "Flashcard 2 Front", back: "Flashcard 2 Back" },
  { id: 3, front: "Flashcard 3 Front", back: "Flashcard 3 Back" },
];

const randomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ["#4E8BC4", "#96CBFC"], // Medium blue → light blue
    ["#96CBFC", "#C2E1FC"], // Light blue → softer pastel blue
    ["#4E8BC4", "#C2E1FC"], // Medium blue → soft pastel blue
    ["#FFC2D9", "#FF99BE"], // Soft pink → rich pastel pink
    ["#FF99BE", "#FFC2D9"], // Rich pastel pink → soft pink
    ["#FFC2D9", "#FEE3EC"], // Soft pink → light pastel pink
    ["#FF99BE", "#F4C9DA"], // Rich pastel pink → soft warm pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function ExploreMoreTopics() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gradientColors, setGradientColors] = useState(randomGradient());
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isLocked, setIsLocked] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  let { userId, searchTopic, level, exploreFlashcards } =
    useLocalSearchParams();
  const flashcards = JSON.parse(exploreFlashcards as string);
  const [isPremium, setIsPremium] = useState<boolean>();

  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token not found");
        router.push("/(tabs)/auth/signin");
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      console.log(decoded?.id);
      //preimium flag
      const userData = await API.get(`/api/users/getme/${decoded?.id}`);
      const userFlag = userData.data.data.flag;
      userFlag === 1 ? setIsPremium(true) : setIsPremium(false);
    };
    initialize();
  }, []);
  const handleFlip = () => {
    let count = 0;

    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(300),
    ]).start(() => {
      setFlipped(!flipped);
      flipAnim.setValue(0);
    });
    setIsLocked(!isPremium && count > 5);
    const isLocked = !isPremium && count > 5;
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderMove: Animated.event([null, { dx: position.x }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 100) {
        Animated.timing(position, {
          toValue: { x: width, y: 0 },
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIndex((prevIndex) => (prevIndex + 1) % mockData.length);
          setFlipped(false);
          setGradientColors(randomGradient());
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text
          style={{
            marginTop: 20,
            color: "#1ca7ec",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          Generated
        </Text>
        <Text style={styles.header}> flashcards for {searchTopic}</Text>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.flashcardContainer,
            { transform: [{ translateX: position.x }] },
          ]}
        >
          <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
            <Animated.View
              style={[
                styles.flashcard,
                {
                  transform: [{ rotateY }],
                },
                isLocked && styles.lockedCard,
              ]}
            >
              {isLocked ? (
                <View style={styles.lockedContent}>
                  {/* <Ionicons name="lock-closed-outline" size={40} color="#888" /> */}
                  <Image
                    source={require("../../assets/images/lock.png")}
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              ) : (
                <LinearGradient
                  colors={gradientColors}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.cardText}>
                    {flipped
                      ? flashcards[index].ExploreFlashcardA
                      : flashcards[index].ExploreFlashcardQ}
                  </Text>
                </LinearGradient>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.instructionText}>
          Swipe to move to the next flashcard...
        </Text>
        {!isPremium ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)/LinkListScreen",
                params: { searchTopic, level },
              })
            }
          >
            <LinearGradient
              colors={["#1ca7ec", "#1ca7ec"]}
              style={styles.nextButton}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignContent: "center",
                  textAlign: "center",
                  fontSize: 18,
                  color: "#fff",
                }}
              >
                want to Explore more?
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/(tabs)/Payment/PremiumScreen" })
            }
          >
            <LinearGradient
              colors={["#FFDF00", "#FCC200", "#FFC627", "#FFCC00", "#FDB515"]}
              style={styles.nextButton}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignContent: "center",
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                Unlock?
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <NavBar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 80,
    marginHorizontal: 30,
    textAlign: "center",
    top: 20,
  },
  flashcardContainer: {
    width: width * 0.8,
    height: height * 0.3,
  },
  flashcard: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backfaceVisibility: "hidden",
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    padding: 20,
  },
  instructionText: {
    fontSize: 14,
    color: "#888888",
    marginTop: 10,
  },
  nextButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#f5bf03",
    borderRadius: 50,
    color: "#fff",
    marginBottom: 20,
    width: 290,
    textAlign: "center",
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  lockedCard: {
    backgroundColor: "#ddd",
    opacity: 0.6,
    width: "100%",
    height: "100%",
  },
  lockedContent: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: "100%",
    borderBlockColor: "#000",
    borderRadius: 16,
  },
});
